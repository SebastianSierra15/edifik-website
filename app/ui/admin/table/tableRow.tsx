import React from "react";
import clsx from "clsx";
import { formatNumber } from "@/utils/formatters";
import { getNestedValue } from "@/utils/getNestedValue";
import { Edit, Trash2 } from "lucide-react";

interface TableRowProps<T> {
  item: T;
  headers: {
    key: keyof T | string;
    type: string;
    subKey?: string;
    statusMapping?: Record<string, { label: string; className: string }>;
  }[];
  onEditClick?: (item: T) => void;
  onDeleteClick?: (item: T) => void;
  actions?: {
    icon: React.ElementType;
    title: string;
    className: string;
    redirectUrl?: string | ((item: T) => string);
    openInNewTab?: boolean;
    onClick?: (item: T) => void;
    shouldRender?: (item: T) => boolean;
  }[];
}

export default function TableRow<T>({
  item,
  headers,
  onEditClick,
  onDeleteClick,
  actions,
}: TableRowProps<T>) {
  return (
    <tr className="h-16 max-h-28 border-t border-premium-borderColor hover:bg-premium-backgroundDark dark:border-premium-borderColorHover dark:hover:bg-premium-backgroundDark">
      {headers.map(({ key, type, subKey, statusMapping }, index) => {
        const value =
          typeof key === "string" ? getNestedValue(item, key) : item[key];

        let content;
        switch (type) {
          case "array":
            content = Array.isArray(value) ? (
              <ul className="list-none pl-5 text-premium-textSecondary dark:text-premium-textSecondary">
                {value.map((subItem: any, i: number) => (
                  <li key={i}>
                    {subKey ? subItem[subKey] : JSON.stringify(subItem)}
                  </li>
                ))}
              </ul>
            ) : null;
            break;

          case "boolean":
            content = (
              <span
                className={clsx(
                  "inline-block rounded-full px-3 py-1 text-sm font-medium",
                  value
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                )}
              >
                {value ? "Activo" : "Inactivo"}
              </span>
            );
            break;

          case "number":
            content = formatNumber(value as number);
            break;

          case "date":
            content = new Date(value as string | number).toLocaleString(
              "es-ES",
              {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              }
            );
            break;

          case "status":
            const statusValue = String(value).toLowerCase();
            const statusConfig = statusMapping?.[statusValue] || {
              label: statusValue,
              className:
                "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
            };
            content = (
              <span
                className={clsx(
                  "inline-block rounded-full px-3 py-1 text-sm font-medium",
                  statusConfig.className
                )}
              >
                {statusConfig.label}
              </span>
            );
            break;

          default:
            content = String(value ?? "");
        }

        return (
          <td
            key={index}
            className="px-4 py-2 text-center text-premium-textPrimary dark:text-premium-textPrimary"
          >
            {content}
          </td>
        );
      })}

      <td className="flex items-center justify-center space-x-2 px-4 py-2">
        {actions
          ?.filter(
            (action) => !action.shouldRender || action.shouldRender(item)
          )
          .map(
            (
              {
                icon: Icon,
                title,
                className,
                redirectUrl,
                openInNewTab,
                onClick,
              },
              i
            ) => {
              const resolvedRedirectUrl =
                typeof redirectUrl === "function"
                  ? redirectUrl(item)
                  : redirectUrl;

              return (
                <button
                  key={i}
                  title={title}
                  className={clsx("transition-colors", className)}
                  onClick={() => {
                    if (onClick) {
                      onClick(item);
                    } else if (resolvedRedirectUrl) {
                      if (openInNewTab) {
                        window.open(resolvedRedirectUrl, "_blank");
                      } else {
                        window.location.href = resolvedRedirectUrl;
                      }
                    }
                  }}
                >
                  <Icon className="h-5 w-5" />
                </button>
              );
            }
          )}

        {onEditClick && (
          <button
            title="Editar"
            onClick={() => onEditClick(item)}
            className="text-blue-500 transition-colors hover:text-blue-600"
          >
            <Edit className="h-4 w-4" />
          </button>
        )}

        {onDeleteClick && (
          <button
            title="Eliminar"
            onClick={() => onDeleteClick(item)}
            className="text-red-500 transition-colors hover:text-red-700"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </td>
    </tr>
  );
}
