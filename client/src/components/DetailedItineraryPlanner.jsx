import React, { useMemo, useState } from 'react';
import { useTrip } from '../context/TripContext';
import { CalendarDays, IndianRupee, Plus, Trash2, NotebookPen, Wand2, GripVertical, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { getActivitySuggestions } from '../services/aiService';

function formatDayDate(startDate, offset) {
    if (!startDate) return 'Date TBD';
    const parsed = new Date(startDate);
    if (Number.isNaN(parsed.getTime())) return 'Date TBD';
    parsed.setDate(parsed.getDate() + offset);
    return parsed.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

const CITY_ACTIVITY_HINTS = {
    agra: ['Visit Taj Mahal at sunrise', 'Explore Agra Fort', 'Try local petha market'],
    varanasi: ['Sunrise boat ride on the ghats', 'Attend Ganga Aarti in evening', 'Walk through old city lanes'],
    chennai: ['Marina Beach morning walk', 'Visit Kapaleeshwarar Temple', 'Try South Indian filter coffee spots'],
    pune: ['Explore Shaniwar Wada area', 'Cafe hopping in Koregaon Park', 'Evening at Sinhagad road viewpoints'],
    bhubaneswar: ['Visit Lingaraj Temple', 'Explore Udayagiri and Khandagiri caves', 'Street food walk in old town'],
    delhi: ['Visit India Gate and Kartavya Path', 'Explore Chandni Chowk', 'Museum or monument circuit'],
};

function getLocalActivitySuggestions(day, selectedRoutes) {
    const route = selectedRoutes[day - 1];
    const city = route?.to?.toLowerCase();
    if (city && CITY_ACTIVITY_HINTS[city]) {
        return CITY_ACTIVITY_HINTS[city];
    }

    return [
        'City center exploration walk',
        'Local food tasting session',
        'Sunset viewpoint and photo stop',
    ];
}

export default function DetailedItineraryPlanner() {
    const { searchParams, selectedRoutes, nights, itineraryDetails, actions } = useTrip();
    const [draftActivities, setDraftActivities] = useState({});
    const [draggingItem, setDraggingItem] = useState(null);
    const [loadingDays, setLoadingDays] = useState({});

    const totalDays = useMemo(() => {
        const routeDays = selectedRoutes.length > 0 ? selectedRoutes.length : 1;
        return Math.max(routeDays, nights, 1);
    }, [selectedRoutes.length, nights]);

    const dayPlansByDay = useMemo(() => {
        const map = new Map();
        itineraryDetails.dayPlans.forEach((plan) => {
            map.set(plan.day, plan);
        });
        return map;
    }, [itineraryDetails.dayPlans]);

    const dayNumbers = Array.from({ length: totalDays }, (_, index) => index + 1);

    const totalPlannedBudget = dayNumbers.reduce((sum, day) => {
        const value = Number(dayPlansByDay.get(day)?.estimatedBudget ?? 0);
        return sum + (Number.isFinite(value) ? value : 0);
    }, 0);

    const handleAddActivity = (day) => {
        const value = draftActivities[day] ?? '';
        if (!value.trim()) return;
        actions.addDayActivity(day, value);
        setDraftActivities((prev) => ({ ...prev, [day]: '' }));
    };

    const addFallbackActivities = (day, existingActivities = []) => {
        const existingSet = new Set(existingActivities.map((item) => item.toLowerCase()));
        getLocalActivitySuggestions(day, selectedRoutes).forEach((suggestion) => {
            if (!existingSet.has(suggestion.toLowerCase())) {
                actions.addDayActivity(day, suggestion);
            }
        });
    };

    const addSuggestedActivities = async (day, existingActivities = []) => {
        const route = selectedRoutes[day - 1];
        const city = route?.to || searchParams.to;

        if (!city) {
            addFallbackActivities(day, existingActivities);
            return;
        }

        setLoadingDays((prev) => ({ ...prev, [day]: true }));

        try {
            const result = await getActivitySuggestions({
                city,
                day,
                date: searchParams.date,
                tripNotes: itineraryDetails.tripNotes,
                existingActivities,
                routeHint: route
                    ? {
                        from: route.from,
                        to: route.to,
                        departure: route.departure,
                        arrival: route.arrival,
                    }
                    : null,
            });

            const aiActivities = Array.isArray(result?.activities)
                ? result.activities.map((item) => String(item).trim()).filter(Boolean)
                : [];

            if (aiActivities.length === 0) {
                addFallbackActivities(day, existingActivities);
                toast('AI suggestions were empty. Added curated suggestions instead.');
                return;
            }

            const existingSet = new Set(existingActivities.map((item) => item.toLowerCase()));
            aiActivities.forEach((activity) => {
                if (!existingSet.has(activity.toLowerCase())) {
                    actions.addDayActivity(day, activity);
                }
            });
            toast.success('AI activities added');
        } catch (error) {
            console.error(error);
            addFallbackActivities(day, existingActivities);
            toast.error('AI unavailable. Added curated fallback suggestions.');
        } finally {
            setLoadingDays((prev) => ({ ...prev, [day]: false }));
        }
    };

    const handleDropOnActivity = (day, targetIndex) => {
        if (!draggingItem || draggingItem.day !== day) return;
        if (draggingItem.day === day) {
            actions.moveDayActivity(day, draggingItem.index, targetIndex);
        } else {
            actions.moveDayActivityAcrossDays(draggingItem.day, draggingItem.index, day, targetIndex);
        }
        setDraggingItem(null);
    };

    const handleDropOnDay = (day) => {
        if (!draggingItem || draggingItem.day === day) return;
        actions.moveDayActivityAcrossDays(draggingItem.day, draggingItem.index, day);
        setDraggingItem(null);
    };

    const copyFromPreviousDay = (day) => {
        if (day <= 1) return;
        const previous = dayPlansByDay.get(day - 1);
        if (!previous) {
            toast('Previous day has no details to copy');
            return;
        }

        actions.upsertDayPlan(day, {
            title: previous.title,
            dayNotes: previous.dayNotes,
            estimatedBudget: previous.estimatedBudget,
            activities: [...previous.activities],
        });
        toast.success(`Copied plan from Day ${day - 1}`);
    };

    return (
        <div className="glass-card p-6 border-border-light mt-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
                        <CalendarDays className="w-6 h-6 text-accent-orange" /> Detailed Itinerary Planner
                    </h2>
                    <p className="text-sm text-text-muted font-medium mt-1">
                        Plan each day with custom notes, activities, and a daily budget.
                    </p>
                </div>
                <div className="bg-primary-bg/60 border border-border-light rounded-xl px-4 py-3 shadow-inner">
                    <div className="text-[10px] text-text-muted uppercase tracking-widest font-black mb-1">Planned Day Budget</div>
                    <div className="text-xl font-black text-accent-orange">₹{totalPlannedBudget}</div>
                </div>
            </div>

            <div className="mb-6">
                <label className="text-xs font-black tracking-widest uppercase text-text-muted mb-2 block">Trip Notes</label>
                <textarea
                    value={itineraryDetails.tripNotes}
                    onChange={(event) => actions.setTripNotes(event.target.value)}
                    rows={3}
                    placeholder="Add booking notes, important reminders, check-in details..."
                    className="w-full bg-primary-bg/40 border border-border-light rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-accent-orange shadow-inner"
                />
            </div>

            <div className="space-y-5">
                {dayNumbers.map((day, index) => {
                    const plan = dayPlansByDay.get(day) ?? { day, title: '', dayNotes: '', activities: [], estimatedBudget: 0 };
                    const defaultTitle = selectedRoutes[index]
                        ? `${selectedRoutes[index].from} to ${selectedRoutes[index].to}`
                        : `Explore & Stay`;

                    return (
                        <div
                            key={day}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={() => handleDropOnDay(day)}
                            className="border border-border-light rounded-2xl p-5 bg-primary-bg/20"
                        >
                            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-4">
                                <div>
                                    <div className="text-[10px] uppercase tracking-widest font-black text-text-muted">Day {day}</div>
                                    <div className="text-sm font-bold text-white">{formatDayDate(searchParams.date, day - 1)}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => copyFromPreviousDay(day)}
                                        disabled={day === 1}
                                        className="text-xs font-black tracking-wide text-text-muted hover:text-white border border-border-light px-3 py-2 rounded-lg inline-flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <Copy className="w-3.5 h-3.5" /> Copy Day {day - 1}
                                    </button>
                                    <div className="flex items-center gap-2 bg-primary-bg/60 border border-border-light rounded-lg px-3 py-2">
                                        <IndianRupee className="w-4 h-4 text-accent-orange" />
                                        <input
                                            type="number"
                                            min="0"
                                            value={plan.estimatedBudget}
                                            onChange={(event) => actions.setDayPlanBudget(day, Number(event.target.value) || 0)}
                                            className="bg-transparent w-28 text-white text-sm font-bold outline-none"
                                            placeholder="Daily budget"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-xs font-black tracking-widest uppercase text-text-muted mb-2 block">Day Theme</label>
                                <input
                                    type="text"
                                    value={plan.title}
                                    onChange={(event) => actions.setDayPlanTitle(day, event.target.value)}
                                    placeholder={defaultTitle}
                                    className="w-full bg-primary-bg/40 border border-border-light rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-accent-orange"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="text-xs font-black tracking-widest uppercase text-text-muted mb-2 block">Day Notes</label>
                                <textarea
                                    rows={2}
                                    value={plan.dayNotes || ''}
                                    onChange={(event) => actions.setDayPlanNotes(day, event.target.value)}
                                    placeholder="Optional note for this day: reservations, travel tips, reminders..."
                                    className="w-full bg-primary-bg/40 border border-border-light rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-accent-orange"
                                />
                            </div>

                            <div>
                                <div className="text-xs font-black tracking-widest uppercase text-text-muted mb-2 flex items-center gap-2">
                                    <NotebookPen className="w-4 h-4" /> Activities
                                </div>

                                <button
                                    onClick={() => addSuggestedActivities(day, plan.activities)}
                                    disabled={Boolean(loadingDays[day])}
                                    className="mb-3 text-xs font-black tracking-wide text-accent-teal hover:text-white border border-accent-teal/40 bg-accent-teal/10 hover:bg-accent-teal/20 px-3 py-2 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                                >
                                    <Wand2 className="w-3.5 h-3.5" /> {loadingDays[day] ? 'Generating...' : 'Suggest Activities'}
                                </button>

                                {plan.activities.length > 0 && (
                                    <div className="space-y-2 mb-3">
                                        {plan.activities.map((activity, activityIndex) => (
                                            <div
                                                key={`${day}-${activityIndex}`}
                                                draggable
                                                onDragStart={() => setDraggingItem({ day, index: activityIndex })}
                                                onDragOver={(event) => event.preventDefault()}
                                                onDrop={() => handleDropOnActivity(day, activityIndex)}
                                                className="flex items-center justify-between gap-3 bg-primary-bg/50 border border-border-light rounded-lg px-3 py-2"
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <GripVertical className="w-4 h-4 text-text-muted shrink-0" />
                                                    <span className="text-sm text-white truncate">{activity}</span>
                                                </div>
                                                <button
                                                    onClick={() => actions.removeDayActivity(day, activityIndex)}
                                                    className="text-text-muted hover:text-red-400 transition-colors"
                                                    aria-label={`Remove activity ${activity}`}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={draftActivities[day] ?? ''}
                                        onChange={(event) =>
                                            setDraftActivities((prev) => ({
                                                ...prev,
                                                [day]: event.target.value,
                                            }))
                                        }
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                handleAddActivity(day);
                                            }
                                        }}
                                        placeholder="Add activity for this day"
                                        className="flex-1 bg-primary-bg/40 border border-border-light rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-accent-orange"
                                    />
                                    <button
                                        onClick={() => handleAddActivity(day)}
                                        className="px-4 py-3 rounded-xl bg-accent-orange text-primary-bg font-black hover:bg-accent-orange-light transition-colors flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" /> Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
