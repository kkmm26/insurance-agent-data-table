import { ColumnDef } from "@tanstack/react-table";
import { addDays, addMonths, isWithinInterval, parse } from 'date-fns';

import { Policy } from "../data";
import { calculateCommissionAmount, cn, formatCurrency } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import RowActions from "./RowActions";

export const columns: ColumnDef<Policy>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: "No",
        enableHiding: false,
        enableSorting: false,
    },
    {
        accessorKey: "clientName",
        header: "Client Name",
    },
    {
        accessorKey: "clientContact",
        header: "Client Contact",
    },
    {
        accessorKey: "policyType",
        header: "Policy Type",
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "companyName",
        header: "Company Name",
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "policyNumber",
        header: "Policy Number",
    },
    {
        accessorKey: "policyStatus",
        header: "Policy Status",
        cell: ({ row }) => {
            return (
                <div className="flex justify-center items-center">
                    <span
                        className={cn(
                            row.original.policyStatus === "Active"
                                ? "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                                : "bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium"
                        )}
                    >
                        {row.original.policyStatus}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "sumInsured",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="p-0"
                >
                    Sum Insured
                    <ArrowUpDown className="w-4 h-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div className="text-right">
                    {formatCurrency(row.original.sumInsured)}
                </div>
            );
        },
    },
    {
        accessorKey: "expiryDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="p-0"
                >
                    Expiry Date
                    <ArrowUpDown className="w-4 h-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <div className="text-right">{row.original.expiryDate}</div>;
        },
        filterFn: (row, id, value) => {
            if (!value) return true; 

            const today = new Date();
            const parsedDate = parse(
                row.getValue(id),
                "MMM dd yyyy",
                new Date()
            );
            if (value === "7 days") {
                return isWithinInterval(parsedDate, {
                    start: today, 
                    end: addDays(today, 7),
                });
            }

            if (value === "1 month") {
                return isWithinInterval(parsedDate, {
                    start: today, 
                    end: addMonths(today, 1), 
                });
            }

            return false;
        },
    },
    {
        accessorKey: "commissionStatus",
        header: "Commission Status",
        cell: ({ row }) => {
            return (
                <div className="flex justify-center items-center">
                    <span
                        className={cn(
                            row.original.commissionStatus === "Paid"
                                ? "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs "
                                : "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs "
                        )}
                    >
                        {row.original.commissionStatus}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "commissionAmount",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="p-0"
                >
                    Commission Amount
                    <ArrowUpDown className="w-4 h-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const commissionAmount = calculateCommissionAmount(
                row.original.sumInsured
            );
            return (
                <div className="text-right">
                    {formatCurrency(commissionAmount)}
                </div>
            );
        },
    },
    {
        accessorKey: "commissionRate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="p-0"
                >
                    Commission Rate
                    <ArrowUpDown className="w-4 h-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div className="text-right">{`${row.original.commissionRate}%`}</div>
            );
        },
    },
    {
        accessorKey: "remarks",
        header: "Remarks",
    },
    {
        id: "actions",
        enableHiding: false,

        cell: () => {
            return (
                <RowActions />
            );
        },
    },
];
