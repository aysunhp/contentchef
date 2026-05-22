import { TrendingUp, Eye, Heart, MessageCircle, Share2 } from "lucide-react";

export default function AnalyticsPanel() {
    const stats = [
        {
            label: "Total Posts",
            value: "42",
            change: "+12%",
            icon: TrendingUp,
            color: "bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-300",
        },
        {
            label: "Total Views",
            value: "12.4K",
            change: "+23%",
            icon: Eye,
            color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300",
        },
        {
            label: "Total Likes",
            value: "3.8K",
            change: "+18%",
            icon: Heart,
            color: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300",
        },
        {
            label: "Comments",
            value: "892",
            change: "+5%",
            icon: MessageCircle,
            color: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300",
        },
    ];

    const topPosts = [
        {
            id: 1,
            title: "10 Quick English Tips",
            views: 3420,
            likes: 540,
            comments: 127,
            date: "May 20",
            status: "published",
        },
        {
            id: 2,
            title: "Common Grammar Mistakes",
            views: 2890,
            likes: 420,
            comments: 98,
            date: "May 18",
            status: "published",
        },
        {
            id: 3,
            title: "Vocabulary Builder Challenge",
            views: 2120,
            likes: 380,
            comments: 76,
            date: "May 16",
            status: "published",
        },
    ];

    const engagementByDay = [
        { day: "Mon", engagement: 240 },
        { day: "Tue", engagement: 420 },
        { day: "Wed", engagement: 380 },
        { day: "Thu", engagement: 510 },
        { day: "Fri", engagement: 680 },
        { day: "Sat", engagement: 450 },
        { day: "Sun", engagement: 290 },
    ];

    const maxEngagement = Math.max(...engagementByDay.map((d) => d.engagement));

    return (
        <section className="flex flex-1 flex-col overflow-hidden">
            <header className="border-b border-gray-200/60 px-6 py-4 dark:border-white/5">
                <h1 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    Analytics & Insights
                </h1>
                <p className="mt-1 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    Track performance across all your posts
                </p>
            </header>

            <div className="scrollbar-hidden flex-1 overflow-y-auto p-6">
                {/* Stats Grid */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-gray-200/60 p-4 dark:border-white/10"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                                            {stat.label}
                                        </p>
                                        <p className="mt-2 text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                                            {stat.value}
                                        </p>
                                        <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                                            {stat.change}
                                        </p>
                                    </div>
                                    <div className={`rounded-lg p-3 ${stat.color}`}>
                                        <Icon size={18} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Engagement Chart */}
                <div className="mb-8 rounded-2xl border border-gray-200/60 p-4 dark:border-white/10">
                    <h2 className="mb-4 font-semibold text-text-primary-light dark:text-text-primary-dark">
                        Weekly Engagement
                    </h2>
                    <div className="flex h-40 items-end justify-between gap-2">
                        {engagementByDay.map((data) => (
                            <div key={data.day} className="flex flex-1 flex-col items-center">
                                <div className="relative w-full">
                                    <div
                                        className="mb-2 w-full rounded-t-lg bg-gradient-to-t from-pastel-violet to-pastel-violet-hover transition-all hover:from-primary-light dark:from-primary-dark dark:dark:to-primary-dark/50"
                                        style={{
                                            height: `${(data.engagement / maxEngagement) * 120}px`,
                                        }}
                                    />
                                </div>
                                <span className="text-[10px] font-medium text-text-secondary-light dark:text-text-secondary-dark">
                                    {data.day}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Posts */}
                <div className="rounded-2xl border border-gray-200/60 p-4 dark:border-white/10">
                    <h2 className="mb-4 font-semibold text-text-primary-light dark:text-text-primary-dark">
                        Top Performing Posts
                    </h2>
                    <div className="space-y-3">
                        {topPosts.map((post) => (
                            <div
                                key={post.id}
                                className="group rounded-xl border border-gray-200/40 bg-surface-light p-3 transition-all hover:border-gray-200/60 dark:border-white/5 dark:bg-surface-dark dark:hover:border-white/10"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <h3 className="text-xs font-medium text-text-primary-light dark:text-text-primary-dark">
                                            {post.title}
                                        </h3>
                                        <p className="mt-1 text-[10px] text-text-secondary-light dark:text-text-secondary-dark">
                                            {post.date}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center gap-4 text-[10px]">
                                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                        <Eye size={12} />
                                        <span>{post.views}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                        <Heart size={12} />
                                        <span>{post.likes}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                                        <MessageCircle size={12} />
                                        <span>{post.comments}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Best Time to Post */}
                <div className="mt-8 rounded-2xl border border-gray-200/60 bg-gradient-to-br from-pastel-violet/10 to-pastel-sky/10 p-4 dark:border-white/5 dark:from-primary-dark/10 dark:to-accent-dark/10">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-pastel-violet p-2 dark:bg-primary-dark">
                            <TrendingUp size={18} className="text-pastel-violet-text dark:text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                                Best Times to Post
                            </h3>
                            <p className="mt-1 text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                Based on your engagement patterns, post during:
                            </p>
                            <ul className="mt-2 space-y-1 text-xs text-text-primary-light dark:text-text-primary-dark">
                                <li>• <strong>Weekdays:</strong> 9:00 AM - 11:00 AM (peak engagement)</li>
                                <li>• <strong>Evenings:</strong> 6:00 PM - 8:00 PM (secondary peak)</li>
                                <li>• <strong>Weekends:</strong> 10:00 AM - 2:00 PM</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
