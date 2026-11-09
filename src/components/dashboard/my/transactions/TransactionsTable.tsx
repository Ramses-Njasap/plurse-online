// src/components/dashboard/my/transactions/TransactionsTable.tsx

"use client";

import type { Transaction } from "@/types/users.types";
import {
    formatDate, formatAmount, shortId, describeTransaction,
} from "@/app/(dashboard)/dashboard/my/transactions/data/mockTransactions";
import { TablePagination } from "@/components/dashboard/my/shared/TablePagination";
import { StatusBadge, TargetBadge } from "./TransactionBadges";
import { TransactionRowMenu } from "./TransactionRowMenu";

interface TransactionsTableProps {
    transactions: Transaction[];
    page: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    onPageChange: (p: number) => void;
    onView: (t: Transaction) => void;
    onRetry: (t: Transaction) => void;
    onCopyId: (t: Transaction) => void;
}

export function TransactionsTable({
    transactions, page, totalPages, totalCount, pageSize,
    onPageChange, onView, onRetry, onCopyId,
}: TransactionsTableProps) {
    const startIndex = (page - 1) * pageSize;

    return (
        <div
            className="overflow-hidden rounded-xl border"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
        >
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13px]">
                    <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-muted)" }}>
                            <Th>#</Th>
                            <Th>Transaction</Th>
                            <Th>Business</Th>
                            <Th>Type</Th>
                            <Th>Amount</Th>
                            <Th>Status</Th>
                            <Th>Created</Th>
                            <Th>Updated</Th>
                            <th className="w-12" />
                        </tr>
                    </thead>

                    <tbody>
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="py-16 text-center text-[13px]" style={{ color: "var(--text-subtle)" }}>
                                    No transactions match your filters.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((t, i) => (
                                <tr
                                    key={t.id}
                                    className="transition-colors"
                                    style={{ borderBottom: "1px solid var(--border)" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-muted)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                >
                                    {/* SN */}
                                    <td className="px-4 py-3.5 font-mono font-medium" style={{ color: "var(--text-subtle)" }}>
                                        #{startIndex + i + 1}
                                    </td>

                                    {/* Transaction */}
                                    <td className="px-4 py-3.5">
                                        <p className="whitespace-nowrap font-semibold" style={{ color: "var(--foreground)" }}>
                                            {describeTransaction(t)}
                                        </p>
                                        <p className="font-mono text-[11px]" style={{ color: "var(--text-subtle)" }}>
                                            {shortId(t.id)}
                                        </p>
                                    </td>

                                    {/* Business */}
                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                        {t.business ? (
                                            <span className="font-medium" style={{ color: "var(--foreground)" }}>{t.business.name}</span>
                                        ) : (
                                            <span style={{ color: "var(--text-subtle)" }}>—</span>
                                        )}
                                    </td>

                                    {/* Type */}
                                    <td className="px-4 py-3.5"><TargetBadge target={t.target_entity} /></td>

                                    {/* Amount */}
                                    <td className="px-4 py-3.5 whitespace-nowrap font-semibold" style={{ color: "var(--foreground)" }}>
                                        {formatAmount(t.amount)}
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3.5">
                                        <StatusBadge status={t.status} />
                                        {t.status === "Failed" && (
                                            <p
                                                className="mt-1 max-w-[220px] truncate text-[11px]"
                                                style={{ color: "var(--text-subtle)" }}
                                                title={t.error_message ?? undefined}
                                            >
                                                {t.error_message ?? "Payment failed"}
                                            </p>
                                        )}
                                        {t.retry_count > 0 && (
                                            <p className="mt-0.5 text-[11px]" style={{ color: "var(--text-subtle)" }}>
                                                Retried {t.retry_count}×
                                            </p>
                                        )}
                                    </td>

                                    {/* Created */}
                                    <td className="px-4 py-3.5 whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                                        {formatDate(t.created_on)}
                                    </td>

                                    {/* Updated */}
                                    <td className="px-4 py-3.5 whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                                        {formatDate(t.updated_on)}
                                    </td>

                                    {/* Row menu */}
                                    <td className="px-3 py-3.5">
                                        <TransactionRowMenu
                                            transaction={t}
                                            dropUp={transactions.length > 4 && i >= transactions.length - 2}
                                            onView={onView}
                                            onRetry={onRetry}
                                            onCopyId={onCopyId}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <TablePagination
                page={page}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={pageSize}
                onPageChange={onPageChange}
            />
        </div>
    );
}

function Th({ children }: { children?: React.ReactNode }) {
    return (
        <th className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
            {children}
        </th>
    );
}