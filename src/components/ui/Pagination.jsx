import React from "react";

const PageButton = ({active, disabled, children, ...rest}) => (
  <button
    {...rest}
    disabled={disabled}
    className={`w-8 h-8 inline-flex items-center justify-center rounded-md border text-xs font-medium transition ${
      active
        ? "bg-gray-900 text-white border-gray-900"
        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
    } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
  >
    {children}
  </button>
);

const Pagination = ({page, totalPages, onChange}) => {
  if (!totalPages || totalPages <= 1) return null;
  const pages = Array.from({length: totalPages}, (_, i) => i + 1).slice(0, 5); // simple cap
  return (
    <div className="flex items-center gap-1">
      <PageButton disabled={page === 1} onClick={() => onChange(page - 1)}>
        &lt;
      </PageButton>
      {pages.map((p) => (
        <PageButton key={p} active={p === page} onClick={() => onChange(p)}>
          {p}
        </PageButton>
      ))}
      <PageButton
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        &gt;
      </PageButton>
    </div>
  );
};

export default Pagination;
