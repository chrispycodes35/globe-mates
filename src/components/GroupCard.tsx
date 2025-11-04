import { Users, MessageCircle, MapPin, School, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GroupCardProps {
  id: string;
  name: string;
  description: string;
  location?: string;
  school?: string;
  members: number;
  category: string;
  isJoined: boolean;
  onJoin?: (groupId: string) => void;
  onOpenChat?: (groupId: string) => void;
}

const categoryIcons: Record<string, typeof Users> = {
  'Study Group': School,
  'Social': Users,
  'Location-Based': MapPin,
  'Events': Calendar,
  'General': Users,
};

const GroupCard = ({ 
  id, 
  name, 
  description, 
  location, 
  school, 
  members, 
  category, 
  isJoined,
  onJoin,
  onOpenChat 
}: GroupCardProps) => {
  const navigate = useNavigate();
  const Icon = categoryIcons[category] || Users;

  const handleClick = () => {
    if (isJoined && onOpenChat) {
      onOpenChat(id);
    } else if (!isJoined && onJoin) {
      onJoin(id);
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer ${
        isJoined ? 'border-2 border-pink-500' : 'border border-gray-200'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{name}</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {category}
            </span>
          </div>
        </div>
        {isJoined && (
          <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
            Joined
          </span>
        )}
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          {location && (
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          )}
          {school && (
            <div className="flex items-center space-x-1">
              <School className="w-4 h-4" />
              <span>{school}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4" />
          <span>{members} members</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        {isJoined ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenChat) onOpenChat(id);
            }}
            className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Open Chat</span>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onJoin) onJoin(id);
            }}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Join Group
          </button>
        )}
      </div>
    </div>
  );
};

export default GroupCard;

