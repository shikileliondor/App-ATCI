<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Comptabilite;
use App\Models\Culte;
use App\Models\Document;
use App\Models\Membre;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class DashboardController extends Controller
{
    public function __invoke(): InertiaResponse
    {
        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        $monthlyTransactions = Comptabilite::query()
            ->whereBetween('date_operation', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->get(['type', 'montant', 'date_operation']);

        $totalBalance = (float) Comptabilite::query()
            ->selectRaw("SUM(CASE WHEN type IN ('dime', 'offrande', 'don') THEN montant ELSE -montant END) as balance")
            ->value('balance');

        $monthlyRevenue = $monthlyTransactions
            ->whereIn('type', ['dime', 'offrande', 'don'])
            ->sum('montant');

        $monthlyExpenses = $monthlyTransactions
            ->where('type', 'autre')
            ->sum('montant');

        $newMembersThisMonth = Membre::query()
            ->whereBetween('date_inscription', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->count();

        $monthlyAttendance = $this->buildMonthlyAttendance($now);

        $weeklyFinances = $this->buildWeeklyFinances($now);

        $latestMembers = Membre::query()
            ->with(['departement:id,nom', 'comite:id,nom'])
            ->latest('date_inscription')
            ->limit(8)
            ->get();

        $recentAccounting = Comptabilite::query()
            ->latest('date_operation')
            ->limit(8)
            ->get();

        $recentCultes = Culte::query()
            ->latest('date_culte')
            ->limit(6)
            ->get();

        $documentsCount = Document::query()->count();

        return Inertia::render('Dashboard', [
            'kpiCards' => [
                ['label' => 'Solde global', 'value' => $this->formatCurrency($totalBalance), 'trend' => 'Calculé sur toutes les opérations', 'trendUp' => $totalBalance >= 0],
                ['label' => 'Revenus du mois', 'value' => $this->formatCurrency((float) $monthlyRevenue), 'trend' => $now->translatedFormat('F Y'), 'trendUp' => true],
                ['label' => 'Dépenses du mois', 'value' => $this->formatCurrency((float) $monthlyExpenses), 'trend' => $now->translatedFormat('F Y'), 'trendUp' => false],
                ['label' => 'Nouveaux membres', 'value' => (string) $newMembersThisMonth, 'trend' => $now->translatedFormat('F Y'), 'trendUp' => true],
            ],
            'attendance' => $monthlyAttendance['values'],
            'months' => $monthlyAttendance['labels'],
            'finances' => $weeklyFinances['values'],
            'financeLabels' => $weeklyFinances['labels'],
            'members' => $latestMembers->map(fn (Membre $membre) => [
                'initials' => $this->initials($membre->prenom, $membre->nom),
                'name' => trim($membre->prenom.' '.$membre->nom),
                'phone' => $membre->telephone,
                'department' => $membre->departement?->nom ?? '-',
                'committee' => $membre->comite?->nom ?? '-',
                'status' => $membre->statut === 'actif' ? 'Actif' : 'Inactif',
            ]),
            'accounting' => $recentAccounting->map(fn (Comptabilite $entry) => [
                'label' => $entry->description ?: 'Opération comptable',
                'amount' => $this->formatCurrency((float) $entry->montant),
                'type' => $this->accountingTypeLabel($entry->type),
            ]),
            'services' => $recentCultes->map(fn (Culte $culte) => [
                'name' => $culte->titre,
                'men' => $culte->hommes_adultes,
                'women' => $culte->femmes_adultes,
                'youth' => $culte->jeunes_hommes + $culte->jeunes_filles,
                'children' => $culte->enfants,
                'visitors' => $culte->visiteurs,
            ]),
            'documentsCount' => $documentsCount,
        ]);
    }

    private function buildMonthlyAttendance(Carbon $referenceDate): array
    {
        $months = collect(range(11, 0))
            ->map(fn (int $i) => $referenceDate->copy()->subMonths($i)->startOfMonth());

        $attendances = Culte::query()
            ->selectRaw('DATE_FORMAT(date_culte, "%Y-%m") as month_key, SUM(total_personnes) as total')
            ->whereDate('date_culte', '>=', $referenceDate->copy()->subMonths(11)->startOfMonth()->toDateString())
            ->groupBy('month_key')
            ->pluck('total', 'month_key');

        return [
            'labels' => $months->map(fn (Carbon $month) => $month->translatedFormat('M'))->values(),
            'values' => $months->map(fn (Carbon $month) => (int) ($attendances[$month->format('Y-m')] ?? 0))->values(),
        ];
    }

    private function buildWeeklyFinances(Carbon $referenceDate): array
    {
        $days = collect(range(6, 0))
            ->map(fn (int $i) => $referenceDate->copy()->subDays($i)->startOfDay());

        $dailyBalances = Comptabilite::query()
            ->selectRaw("date_operation as day_key, SUM(CASE WHEN type IN ('dime', 'offrande', 'don') THEN montant ELSE -montant END) as total")
            ->whereDate('date_operation', '>=', $referenceDate->copy()->subDays(6)->toDateString())
            ->groupBy('day_key')
            ->pluck('total', 'day_key');

        $rawValues = $days
            ->map(fn (Carbon $day) => (float) ($dailyBalances[$day->toDateString()] ?? 0.0));

        $maxAbsValue = max(1.0, $rawValues->map(fn (float $value) => abs($value))->max());

        return [
            'labels' => $days->map(fn (Carbon $day) => $day->translatedFormat('D'))->values(),
            'values' => $rawValues
                ->map(fn (float $value) => max(4, (int) round((abs($value) / $maxAbsValue) * 100)))
                ->values(),
        ];
    }

    private function formatCurrency(float $amount): string
    {
        return number_format($amount, 0, ',', ' ').' FCFA';
    }

    private function initials(?string $firstName, ?string $lastName): string
    {
        return strtoupper(substr((string) $firstName, 0, 1).substr((string) $lastName, 0, 1));
    }

    private function accountingTypeLabel(string $type): string
    {
        return match ($type) {
            'dime' => 'Dîme',
            'offrande' => 'Offrande',
            'don' => 'Don',
            default => 'Sortie',
        };
    }
}
