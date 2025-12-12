import { Link, useNavigate } from "react-router-dom";

const items = [
  { name: "Se connecter", path: "/login" },
];

export const ClientHomePageHeader = () => {
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo + brand */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 focus:outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-lg shadow-md">
            TC
          </div>
          <span className="text-xl font-semibold tracking-tight text-slate-900">
            TicketChain
          </span>
        </button>

        {/* Nav */}
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
          {items.map((item) =>
            item.name === "Se connecter" ? (
              <button
                key={item.name}
                onClick={() => navigate("/login")}
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition"
              >
                {item.name}
              </button>
            ) : (
              <Link
                key={item.name}
                to={item.path}
                className="relative pb-1 hover:text-slate-900 transition before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-slate-900 before:transition-all hover:before:w-full"
              >
                {item.name}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
};