import React, {useEffect, useState, useMemo} from "react";
import client from "../../api/client";
import {Badge} from "../ui/Badge";
import Pagination from "../ui/Pagination";
import "./AllStudents.css";

const planLabels = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

const statusLabels = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
};

function getPlanType(planId) {
  // Example mapping, replace with actual logic if needed
  if (!planId) return "";
  if (planId.toLowerCase().includes("month")) return planLabels.monthly;
  if (planId.toLowerCase().includes("quarter")) return planLabels.quarterly;
  if (planId.toLowerCase().includes("year")) return planLabels.yearly;
  return "Monthly";
}

function getFeeStatus(feePaid, expires) {
  if (feePaid) return statusLabels.paid;
  if (!expires) return statusLabels.pending;
  const d = new Date(expires);
  if (isNaN(d.getTime())) return statusLabels.pending;
  if (d < new Date()) return statusLabels.overdue;
  return statusLabels.pending;
}

const PAGE_SIZE = 5;

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [rawPayload, setRawPayload] = useState(null); // debug original response
  const [expiries, setExpiries] = useState({}); // { userId(or seatNumber): { date, daysLeft, planName } }
  const [expiryLoading, setExpiryLoading] = useState(false);
  const [expiryError, setExpiryError] = useState("");
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    client
      .get("/admin/users")
      .then((res) => {
        setRawPayload(res.data);
        const data = res.data;
        let arr = [];
        if (Array.isArray(data)) arr = data;
        else {
          const candidateKeys = [
            "users",
            "students",
            "data",
            "result",
            "items",
            "records",
          ];
          for (const k of candidateKeys) {
            if (Array.isArray(data?.[k])) {
              arr = data[k];
              break;
            }
          }
        }
        setStudents(arr);
        setError("");
      })
      .catch((err) => {
        if (err.response) {
          const msg =
            err.response.data?.message || `HTTP ${err.response.status}`;
          setError(msg);
        } else {
          setError("Network error");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const retryFetch = () => {
    setLoading(true);
    client
      .get("/admin/users")
      .then((res) => {
        setRawPayload(res.data);
        const data = res.data;
        let arr = [];
        if (Array.isArray(data)) arr = data;
        else {
          const candidateKeys = [
            "users",
            "students",
            "data",
            "result",
            "items",
            "records",
          ];
          for (const k of candidateKeys) {
            if (Array.isArray(data?.[k])) {
              arr = data[k];
              break;
            }
          }
        }
        setStudents(arr);
        setError("");
      })
      .catch((err) => {
        const msg =
          err.response?.data?.message ||
          (err.response ? `HTTP ${err.response.status}` : "Network error");
        setError(msg);
      })
      .finally(() => setLoading(false));
  };

  // Fetch subscription expirations (bulk) once students are loaded.
  // Provided sample response shape:
  // { message, count, users: [ { name, seatNumber, expirationDate, daysLeft, planName } ] }
  useEffect(() => {
    if (!students.length) return;
    let cancelled = false;
    setExpiryLoading(true);
    setExpiryError("");

    (async () => {
      try {
        const res = await client.get("/admin/subscription-ending");
        if (cancelled) return;
        const data = res.data;
        const list = Array.isArray(data?.users) ? data.users : [];

        if (!list.length) {
          setExpiryError("No expiry data found");
        } else {
          setExpiries((prev) => {
            const next = {...prev};
            list.forEach((u) => {
              const key = u.seatNumber || u._id || u.name; // seat preferred
              if (!key) {
                return;
              }
              next[key] = {
                date: u.expirationDate || u.expires || u.expiryDate || null,
                daysLeft: u.daysLeft,
                planName: u.planName,
              };
            });
            return next;
          });
        }
      } catch (e) {
        setExpiryError("Failed to load expiry data");
      }
      if (!cancelled) setExpiryLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [students]);

  // Derived data and columns (missing after accidental truncation)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      const planText = getPlanType(s.subscriptionPlan).toLowerCase();
      const expiryObj = expiries[s.seatNumber] || expiries[s._id];
      const statusText = getFeeStatus(s.feePaid, expiryObj?.date).toLowerCase();
      const matchesQuery =
        !q ||
        [s.name, s.adharNumber, s.idNumber, s.seatNumber, s.email].some(
          (v) =>
            v !== undefined && v !== null && String(v).toLowerCase().includes(q)
        );
      const matchesPlan = !planFilter || planText === planFilter;
      const matchesStatus = !statusFilter || statusText === statusFilter;
      return matchesQuery && matchesPlan && matchesStatus;
    });
  }, [students, search, planFilter, statusFilter, expiries]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );
  useEffect(() => {
    setPage(1);
  }, [search, planFilter, statusFilter]);
  const columns = [
    {key: "student", label: "STUDENT", className: "w-64"},
    {key: "age", label: "AGE", className: "w-14"},
    {key: "seat", label: "SEAT", className: "w-20"},
    {key: "plan", label: "PLAN", className: "w-28"},
    {key: "joined", label: "JOINED", className: "w-32"},
    {key: "expires", label: "EXPIRES", className: "w-32"},
    {key: "status", label: "FEE STATUS", className: "w-28"},
    {key: "actions", label: "ACTIONS", className: "w-28"},
  ];

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">All Students</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and view all registered students
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search students..."
            className="w-full h-10 rounded-md border border-gray-300 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
          >
            <option value="">All Plans</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <select
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
          <button
            className="h-10 inline-flex items-center rounded-md border border-gray-300 px-3 text-sm hover:bg-gray-50"
            title="More filters"
          >
            ⚙️
          </button>
          <button className="h-10 inline-flex items-center rounded-md bg-gray-900 text-white px-4 text-sm font-medium shadow-sm hover:bg-black/90">
            + Add New Student
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm flex items-start justify-between gap-4">
          <div>
            <p className="font-medium mb-1">Authentication issue</p>
            <ul className="list-disc ml-5 space-y-1 text-xs">
              <li>
                Open DevTools Console (F12) and verify the [API] request log
                shows authPresent=true.
              </li>
              <li>
                Check localStorage token: in console run{" "}
                <code>localStorage.getItem('token')</code>.
              </li>
              <li>
                If it lacks the word Bearer, re-login to get a fresh token.
              </li>
              <li>
                Confirm token not expired (decoded exp printed in console if
                present).
              </li>
              <li>Server message: {error}</li>
            </ul>
          </div>
          <button
            onClick={retryFetch}
            className="shrink-0 h-8 px-3 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Debug (no data but payload present) */}
      {!loading && !error && students.length === 0 && rawPayload && (
        <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          <p className="font-medium mb-1">
            No students extracted from response.
          </p>
          <p className="mb-2">
            Payload keys: {Object.keys(rawPayload).join(", ") || "(none)"}
          </p>
          <details className="mb-2">
            <summary className="cursor-pointer select-none">
              Show raw payload JSON
            </summary>
            <pre className="mt-2 whitespace-pre-wrap break-all max-h-60 overflow-auto bg-white/70 p-2 rounded border border-amber-100">
              {JSON.stringify(rawPayload, null, 2)}
            </pre>
          </details>
          <p>
            Edit extraction logic in <code>AllStudents.jsx</code> if your array
            is nested deeper (e.g. data.payload.list).
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-[11px] tracking-wide text-gray-600">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-medium text-left ${
                    col.className || ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading &&
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4" colSpan={8}>
                    <div className="h-3 rounded bg-gray-100 w-1/3 mb-2"></div>
                    <div className="h-3 rounded bg-gray-100 w-1/5"></div>
                    <div className="h-3 rounded bg-gray-100 w-1/5"></div>
                  </td>
                </tr>
              ))}
            {!loading && paginated.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-gray-400 text-sm"
                >
                  No students found.
                </td>
              </tr>
            )}
            {!loading &&
              paginated.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="/vite.svg"
                        alt="avatar"
                        className="w-9 h-9 rounded-full bg-gray-100 p-1"
                      />
                      <div className="leading-tight">
                        <div className="font-medium text-gray-900 text-[13px]">
                          {s.name}
                        </div>
                        <div className="text-[11px] text-gray-500">{`Adhaar: ${
                          s.adharNumber || "-"
                        }`}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[13px] text-gray-700">
                    {s.age || "-"}
                  </td>
                  <td className="px-4 py-4 text-[13px] text-gray-700">
                    {s.seatNumber || "-"}
                  </td>
                  <td className="px-4 py-4">
                    <Badge tone="neutral">
                      {getPlanType(s.subscriptionPlan)}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-[13px] text-gray-700">
                    {s.joiningDate
                      ? new Date(s.joiningDate).toLocaleDateString(undefined, {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })
                      : "-"}
                  </td>
                  <td className="px-4 py-4 text-[13px] text-gray-700">
                    {(() => {
                      const exp =
                        expiries[s.seatNumber]?.date || expiries[s._id]?.date;
                      if (expiryLoading && !exp)
                        return <span className="text-gray-400">…</span>;
                      if (!exp) return "-";
                      try {
                        return new Date(exp).toLocaleDateString(undefined, {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        });
                      } catch {
                        return exp;
                      }
                    })()}
                    {(() => {
                      const info = expiries[s.seatNumber] || expiries[s._id];
                      if (
                        info?.daysLeft !== undefined &&
                        info?.daysLeft !== null
                      ) {
                        return (
                          <span className="ml-2 text-xs text-gray-500">
                            ({info.daysLeft}d)
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      tone={
                        getFeeStatus(
                          s.feePaid,
                          (expiries[s.seatNumber] || expiries[s._id])?.date
                        ) === "Paid"
                          ? "green"
                          : getFeeStatus(
                              s.feePaid,
                              (expiries[s.seatNumber] || expiries[s._id])?.date
                            ) === "Pending"
                          ? "yellow"
                          : "red"
                      }
                    >
                      {getFeeStatus(
                        s.feePaid,
                        (expiries[s.seatNumber] || expiries[s._id])?.date
                      )}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3 text-gray-400 text-xs">
                      <button className="hover:text-gray-700" title="View">
                        👁️
                      </button>
                      <button className="hover:text-gray-700" title="Edit">
                        ✏️
                      </button>
                      <button className="hover:text-red-600" title="Delete">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4">
        <p className="text-xs text-gray-500">
          Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
          {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
          results
        </p>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
};

export default AllStudents;
