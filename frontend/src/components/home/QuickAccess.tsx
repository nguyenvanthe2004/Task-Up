import { Folder, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Space } from "../../types/space";

const SPACE_COLORS = [
  "bg-blue-50 text-blue-600",
  "bg-purple-50 text-purple-600",
  "bg-orange-50 text-orange-600",
  "bg-green-50 text-green-600",
  "bg-pink-50 text-pink-600",
];

interface Props {
  spaces: Space[];
}

const QuickAccess: React.FC<Props> = ({ spaces }) => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  if (spaces.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Star className="text-indigo-600 w-4 h-4" />
        <h2 className="text-sm font-bold text-slate-900">Quick Access</h2>
        <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {spaces.length}
        </span>
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4">
        {spaces.map((space: any, i) => (
          <div
            key={space.id}
            onClick={() => navigate(`/${workspaceId}/spaces/${space.id}`)}
            className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group"
          >
            {/* Dùng color từ API nếu có, fallback sang preset */}
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-lg ${
                space.color ? "" : SPACE_COLORS[i % SPACE_COLORS.length]
              }`}
              style={space.color ? { backgroundColor: space.color + "20", color: space.color } : {}}
            >
              {/* Nếu icon là emoji hiển thị emoji, nếu là icon name hiển thị Folder */}
              {space.icon && space.icon.length <= 2 ? (
                <span>{space.icon}</span>
              ) : (
                <Folder className="w-5 h-5" />
              )}
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors truncate">
              {space.name}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              {space.description || "No description"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuickAccess;