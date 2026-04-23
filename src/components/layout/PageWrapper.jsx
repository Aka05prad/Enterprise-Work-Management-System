const PageWrapper = ({ title, subtitle, actions, children }) => (
  <div className="flex flex-col gap-6">
    {(title || actions) && (
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          {title && (
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    )}
    {children}
  </div>
);

export default PageWrapper;