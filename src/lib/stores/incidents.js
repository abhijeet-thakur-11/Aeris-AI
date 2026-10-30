import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';

// Real-time store for incidents
function createIncidentsStore() {
    const { subscribe, set, update } = writable([]);

    return {
        subscribe,
        // Initial fetch from FastAPI or Supabase directly
        fetchInitial: async () => {
            const { data, error } = await supabase
                .from('incidents')
                .select('*')
                .eq('status', 'Active');
            
            if (error) {
                console.error("Error fetching incidents:", error);
                return;
            }
            set(data);
        },
        // Subscribe to real-time changes
        subscribeToChanges: () => {
            const subscription = supabase
                .channel('public:incidents')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, payload => {
                    update(current => {
                        if (payload.eventType === 'INSERT') {
                            return [...current, payload.new];
                        }
                        if (payload.eventType === 'UPDATE') {
                            return current.map(inc => inc.id === payload.new.id ? payload.new : inc);
                        }
                        if (payload.eventType === 'DELETE') {
                            return current.filter(inc => inc.id !== payload.old.id);
                        }
                        return current;
                    });
                })
                .subscribe();
            
            return () => {
                supabase.removeChannel(subscription);
            };
        }
    };
}

export const activeIncidents = createIncidentsStore();
