
import * as React from "react";
import { MessageSquare, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export function ChatsList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = React.useState<ChatSession[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Load chat sessions
  React.useEffect(() => {
    if (!user) return;

    const loadSessions = async () => {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading chat sessions:', error);
      } else {
        setSessions(data || []);
      }
      setLoading(false);
    };

    loadSessions();
  }, [user]);

  const createNewChat = () => {
    const newSessionId = crypto.randomUUID();
    navigate(`/chat/${newSessionId}`);
  };

  const openChat = (sessionId: string) => {
    navigate(`/chat/${sessionId}`);
  };

  if (loading) {
    return (
      <section>
        <div className="font-bold text-lg text-[#333] mb-3 flex items-center gap-2">
          <MessageSquare className="text-[#3b9fe6]" /> Chats
        </div>
        <div className="text-gray-500">Loading chats...</div>
      </section>
    );
  }

  return (
    <section>
      <div className="font-bold text-lg text-[#333] mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-[#3b9fe6]" /> Chats
        </div>
        <Button
          onClick={createNewChat}
          size="sm"
          className="bg-[#3b9fe6] hover:bg-[#2a8dd9] text-white"
        >
          <Plus className="w-4 h-4 mr-1" />
          New
        </Button>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="mb-4">No chats yet</p>
          <Button
            onClick={createNewChat}
            className="bg-[#3b9fe6] hover:bg-[#2a8dd9] text-white"
          >
            Start your first chat
          </Button>
        </div>
      ) : (
        <ul className="space-y-4">
          {sessions.map((session) => (
            <li
              key={session.id}
              onClick={() => openChat(session.id)}
              className="p-4 rounded-xl bg-white shadow border border-[#eaeaea] flex flex-col gap-1 hover:bg-[#3b9fe6]/10 transition cursor-pointer"
            >
              <span className="font-semibold text-md mb-1 text-[#3b9fe6]">
                {session.title}
              </span>
              <span className="text-gray-600 text-sm">
                {new Date(session.updated_at).toLocaleDateString()}
              </span>
              <span className="inline-block text-xs font-semibold px-2 py-1 rounded mt-1 bg-[#eaeaea] text-[#3b9fe6]">
                Chat
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
