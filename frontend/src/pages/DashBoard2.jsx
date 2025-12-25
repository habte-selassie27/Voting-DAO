import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { BarChart3, Users, Clock, TrendingUp } from 'lucide-react'

/* ------------------ Helpers ------------------ */
function formatTimeRemaining(endTime, now) {
  const diff = endTime - now
  if (diff <= 0) return 'Ended'

  const totalSeconds = Math.floor(diff / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) return `Ends in ${hours}h ${minutes}m ${seconds}s`
  if (minutes > 0) return `Ends in ${minutes}m ${seconds}s`
  return `Ends in ${seconds}s`
}

/* ------------------ Stat Card ------------------ */
// eslint-disable-next-line no-unused-vars
// function StatCard({  value, subtitle, icon: Icon, colorClass }) {
//   return (
//     <div className={`flex items-center justify-between rounded-3xl p-6 shadow-md ${colorClass}`}>
//       <div>
//         <p className="text-3xl font-bold text-gray-800">{value}</p>
//         <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
//       </div>
//       <Icon className="w-10 h-10" />
//     </div>
//   )
// }

// eslint-disable-next-line no-unused-vars
function StatCard({ value, subtitle, icon: Icon, bgClass, iconColor }) {
  return (
    <div className={`flex items-center justify-between ${bgClass} rounded-3xl p-7 shadow-lg card-hover`}>
      <div>
        <p className="text-4xl font-extrabold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600 mt-2">{subtitle}</p>
      </div>
      <Icon className={`w-14 h-14 ${iconColor}`} />
    </div>
  )
}
/* ------------------ Main Component ------------------ */
export function VotingStats({ polls = [] }) {
  const [now, setNow] = useState(() => Date.now())
  const notifiedPollsRef = useRef(new Set())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    polls.forEach(poll => {
      if (poll.endTime <= now && !notifiedPollsRef.current.has(poll.id)) {
        notifiedPollsRef.current.add(poll.id)
        toast.success('Poll ended', { description: poll.title })
      }
    })
  }, [polls, now])

  const totalPolls = polls.length
  const activePolls = useMemo(
    () => polls.filter(p => p.isActive && p.endTime > now).length,
    [polls, now]
  )
  const endedPolls = useMemo(
    () => polls.filter(p => p.endTime <= now).length,
    [polls, now]
  )
  const totalVotes = useMemo(
    () => polls.reduce((sum, p) => sum + (p.totalVotes || 0), 0),
    [polls]
  )

  // Dynamic percentage for active polls
  const activePercentage = totalPolls > 0 
    ? `${Math.round((activePolls / totalPolls) * 100)}% currently active`
    : '0% currently active'

  return (
    <div className="bg-blue-50/30 py-12 px-4"> {/* Very light background tint */}
      <div className="max-w-6xl mx-auto space-y-12">
        {/* ------------------ Stats Cards Row ------------------ */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Polls"
            value={totalPolls}
            subtitle="All created polls"
            icon={BarChart3}
            colorClass="bg-blue-100 text-blue-600"
          />
          <StatCard
            label="Active Polls"
            value={activePolls}
            subtitle={activePercentage}
            icon={Clock}
            colorClass="bg-green-100 text-green-600"
          />
          <StatCard
            label="Total Votes"
            value={totalVotes}
            subtitle="Across all polls"
            icon={Users}
            colorClass="bg-purple-100 text-purple-600"
          />
          <StatCard
            label="Completed"
            value={endedPolls}
            subtitle="Results available for viewing"
            icon={TrendingUp}
            colorClass="bg-orange-100 text-orange-600"
          />
        </div> */}


        
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
  <StatCard value={totalPolls} subtitle="All created polls" icon={BarChart3} bgClass="bg-blue-50" iconColor="text-blue-500" />
  <StatCard value={activePolls} subtitle={activePercentage} icon={Clock} bgClass="bg-green-50" iconColor="text-green-500" />
  <StatCard value={totalVotes} subtitle="Across all polls" icon={Users} bgClass="bg-purple-50" iconColor="text-purple-500" />
  <StatCard value={endedPolls} subtitle="Results available for viewing" icon={TrendingUp} bgClass="bg-orange-50" iconColor="text-orange-500" />
</div>

        {/* ------------------ Live Countdown List (optional - kept light) ------------------ */}
        <div className="space-y-3 max-w-4xl mx-auto">
          {polls.map(poll => {
            const isActive = poll.endTime > now
            return (
              <div
                key={poll.id}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-6 py-4 shadow-sm"
              >
                <div>
                  <p className="font-semibold text-gray-800">{poll.title}</p>
                  <p className="text-sm text-gray-600">
                    {isActive ? formatTimeRemaining(poll.endTime, now) : 'Ended'}
                  </p>
                </div>
                <span
                  className={`text-sm font-medium px-4 py-2 rounded-full ${
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {isActive ? 'Active' : 'Ended'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// import { useEffect, useMemo, useRef, useState } from 'react'
// import { toast } from 'sonner'
// import { BarChart3, Users, Clock, TrendingUp } from 'lucide-react'
// import React from 'react'

// /* ------------------ Helpers ------------------ */
// function formatTimeRemaining(endTime, now) {
//   const diff = endTime - now
//   if (diff <= 0) return 'Ended'

//   const totalSeconds = Math.floor(diff / 1000)
//   const hours = Math.floor(totalSeconds / 3600)
//   const minutes = Math.floor((totalSeconds % 3600) / 60)
//   const seconds = totalSeconds % 60

//   if (hours > 0) return `Ends in ${hours}h ${minutes}m ${seconds}s`
//   if (minutes > 0) return `Ends in ${minutes}m ${seconds}s`
//   return `Ends in ${seconds}s`
// }

// /* ------------------ Stat Card ------------------ */
// // eslint-disable-next-line no-unused-vars
// function StatCard({ label, value, icon: Icon }) {
//   return (
//     <div className="w-full md:w-64 bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow transition-shadow">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm text-gray-600">{label}</p>
//           <p className="text-2xl font-bold mt-1">{value}</p>
//         </div>
//         <Icon className="w-10 h-10 text-gray-700 opacity-80" />
//       </div>
//     </div>
//   )
// }

// /* ------------------ Main Component ------------------ */
// export function VotingStats({ polls = [] }) {
//   const [now, setNow] = useState(() => Date.now())
//   const notifiedPollsRef = useRef(new Set())

//   useEffect(() => {
//     const interval = setInterval(() => setNow(Date.now()), 1000)
//     return () => clearInterval(interval)
//   }, [])

//   useEffect(() => {
//     polls.forEach(poll => {
//       if (poll.endTime <= now && !notifiedPollsRef.current.has(poll.id)) {
//         notifiedPollsRef.current.add(poll.id)
//         toast.success('Poll ended', { description: poll.title })
//       }
//     })
//   }, [polls, now])

//   const totalPolls = polls.length
//   const activePolls = useMemo(
//     () => polls.filter(p => p.isActive && p.endTime > now).length,
//     [polls, now]
//   )
//   const endedPolls = useMemo(
//     () => polls.filter(p => p.endTime <= now).length,
//     [polls, now]
//   )
//   const totalVotes = useMemo(
//     () => polls.reduce((sum, p) => sum + (p.totalVotes || 0), 0),
//     [polls]
//   )

//   return (
//     <div className="space-y-8">
//       {/* ------------------ Stats Cards Row ------------------ */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard label="Total Polls" value={totalPolls} icon={BarChart3} />
//         <StatCard label="Active Polls" value={activePolls} icon={Clock} />
//         <StatCard label="Total Votes" value={totalVotes} icon={Users} />
//         <StatCard label="Completed" value={endedPolls} icon={TrendingUp} />
//       </div>

//       {/* ------------------ Live Countdown List ------------------ */}
//       <div className="space-y-3">
//         {polls.map(poll => {
//           const isActive = poll.endTime > now
//           return (
//             <div
//               key={poll.id}
//               className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
//             >
//               <div>
//                 <p className="font-medium">{poll.title}</p>
//                 <p className="text-xs text-gray-600">
//                   {poll.isActive
//                     ? formatTimeRemaining(poll.endTime, now)
//                     : 'Inactive'}
//                 </p>
//               </div>
//               <span
//                 className={`text-xs font-medium px-2 py-1 rounded ${
//                   isActive
//                     ? 'bg-green-100 text-green-700'
//                     : 'bg-gray-200 text-gray-600'
//                 }`}
//               >
//                 {isActive ? 'Active' : 'Ended'}
//               </span>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }
// import { useEffect, useMemo, useRef, useState } from 'react'
// import { toast } from 'sonner'
// import { BarChart3, Users, Clock, TrendingUp } from 'lucide-react'
// import React from 'react'

// /* ------------------ Helpers ------------------ */
// function formatTimeRemaining(endTime, now) {
//   const diff = endTime - now
//   if (diff <= 0) return 'Ended'

//   const totalSeconds = Math.floor(diff / 1000)
//   const hours = Math.floor(totalSeconds / 3600)
//   const minutes = Math.floor((totalSeconds % 3600) / 60)
//   const seconds = totalSeconds % 60

//   if (hours > 0) return `Ends in ${hours}h ${minutes}m ${seconds}s`
//   if (minutes > 0) return `Ends in ${minutes}m ${seconds}s`
//   return `Ends in ${seconds}s`
// }

// /* ------------------ Stat Card ------------------ */
// function StatCard({ label, value, icon }) {
//   return (
//     <div className="flex-1 bg-white border border-gray-300 rounded-xl p-6 flex items-center justify-between shadow-sm">
//       <div>
//         <p className="text-sm text-gray-600">{label}</p>
//         <p className="text-2xl font-bold">{value}</p>
//       </div>

//       {React.createElement(icon, { className: 'w-6 h-6 text-gray-700' })}
//     </div>
//   )
// }

// /* ------------------ Main Component ------------------ */
// export function VotingStats({ polls = [] }) {
//   const [now, setNow] = useState(() => Date.now())
//   const notifiedPollsRef = useRef(new Set())

//   useEffect(() => {
//     const interval = setInterval(() => setNow(Date.now()), 1000)
//     return () => clearInterval(interval)
//   }, [])

//   useEffect(() => {
//     polls.forEach(poll => {
//       if (poll.endTime <= now && !notifiedPollsRef.current.has(poll.id)) {
//         notifiedPollsRef.current.add(poll.id)
//         toast.success('Poll ended', { description: poll.title })
//       }
//     })
//   }, [polls, now])

//   const totalPolls = polls.length
//   const activePolls = useMemo(
//     () => polls.filter(p => p.isActive && p.endTime > now).length,
//     [polls, now]
//   )
//   const endedPolls = useMemo(
//     () => polls.filter(p => p.endTime <= now).length,
//     [polls, now]
//   )
//   const totalVotes = useMemo(
//     () => polls.reduce((sum, p) => sum + (p.totalVotes || 0), 0),
//     [polls]
//   )

//   return (
//     <div className="space-y-8">
//       {/* ------------------ Stats Cards ------------------ */}
//       <div className="flex flex-wrap gap-6">
//         <StatCard label="Total Polls" value={totalPolls} icon={BarChart3} />
//         <StatCard label="Active Polls" value={activePolls} icon={Clock} />
//         <StatCard label="Total Votes" value={totalVotes} icon={Users} />
//         <StatCard label="Completed" value={endedPolls} icon={TrendingUp} />
//       </div>

//       {/* ------------------ Live Countdown List ------------------ */}
//       <div className="space-y-3">
//         {polls.map(poll => {
//           const isActive = poll.endTime > now
//           return (
//             <div
//               key={poll.id}
//               className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
//             >
//               <div>
//                 <p className="font-medium">{poll.title}</p>
//                 <p className="text-xs text-gray-600">
//                   {poll.isActive
//                     ? formatTimeRemaining(poll.endTime, now)
//                     : 'Inactive'}
//                 </p>
//               </div>
//               <span
//                 className={`text-xs font-medium px-2 py-1 rounded ${
//                   isActive
//                     ? 'bg-green-100 text-green-700'
//                     : 'bg-gray-200 text-gray-600'
//                 }`}
//               >
//                 {isActive ? 'Active' : 'Ended'}
//               </span>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }










// import React from 'react'
// import { useEffect, useMemo, useRef, useState } from 'react'
// import { toast } from 'sonner'
// import { BarChart3, Users, Clock, TrendingUp } from 'lucide-react'

// /* ------------------ Helpers ------------------ */

// function formatTimeRemaining(endTime, now) {
//   const diff = endTime - now
//   if (diff <= 0) return 'Ended'

//   const totalSeconds = Math.floor(diff / 1000)
//   const hours = Math.floor(totalSeconds / 3600)
//   const minutes = Math.floor((totalSeconds % 3600) / 60)
//   const seconds = totalSeconds % 60

//   if (hours > 0) return `Ends in ${hours}h ${minutes}m ${seconds}s`
//   if (minutes > 0) return `Ends in ${minutes}m ${seconds}s`
//   return `Ends in ${seconds}s`
// }

// /* ------------------ Stat Card ------------------ */

// function StatCard({ label, value, icon }) {
//   return (
//     <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-between">
//       <div>
//         <p className="text-sm text-gray-600">{label}</p>
//         <p className="text-2xl font-bold">{value}</p>
//       </div>
//       {
//         React.createElement(icon, {
//         className: 'w-6 h-6 text-gray-700'
//       })
//       }
     
//       {/* <Icon className="w-6 h-6 text-gray-700" /> */}
    
//     </div>
//   )
// }

// /* ------------------ Main Component ------------------ */

// export function VotingStats({ polls = [] }) {
//   // ⏱ second-precision clock
//   const [now, setNow] = useState(() => Date.now())

//   // 🔔 Track which polls already triggered a toast
//   const notifiedPollsRef = useRef(new Set())

//   // Update time every second
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setNow(Date.now())
//     }, 1000)

//     return () => clearInterval(interval)
//   }, [])

//   // 🔔 Toast when poll ends (fires ONCE per poll)
//   useEffect(() => {
//     polls.forEach(poll => {
//       if (poll.endTime <= now && !notifiedPollsRef.current.has(poll.id)) {
//         notifiedPollsRef.current.add(poll.id)

//         toast.success('Poll ended', {
//           description: poll.title
//         })
//       }
//     })
//   }, [polls, now])

//   /* ------------------ Derived Stats ------------------ */

//   const totalPolls = polls.length

//   const activePolls = useMemo(
//     () => polls.filter(p => p.isActive && p.endTime > now).length,
//     [polls, now]
//   )

//   const endedPolls = useMemo(
//     () => polls.filter(p => p.endTime <= now).length,
//     [polls, now]
//   )

//   const totalVotes = useMemo(
//     () => polls.reduce((sum, p) => sum + (p.totalVotes || 0), 0),
//     [polls]
//   )

//   /* ------------------ Render ------------------ */

//   return (
//     <div className="space-y-8">
//       {/* 📊 Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard label="Total Polls" value={totalPolls} icon={BarChart3} />
//         <StatCard label="Active Polls" value={activePolls} icon={Clock} />
//         <StatCard label="Total Votes" value={totalVotes} icon={Users} />
//         <StatCard label="Completed" value={endedPolls} icon={TrendingUp} />
//       </div>

//       {/* ⏳ Live Countdown List */}
//       <div className="space-y-3">
//         {polls.map(poll => {
//           const isActive = poll.endTime > now

//           return (
//             <div
//               key={poll.id}
//               className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
//             >
//               <div>
//                 <p className="font-medium">{poll.title}</p>
//                 <p className="text-xs text-gray-600">
//                   {poll.isActive
//                     ? formatTimeRemaining(poll.endTime, now)
//                     : 'Inactive'}
//                 </p>
//               </div>

//               <span
//                 className={`text-xs font-medium px-2 py-1 rounded ${
//                   isActive
//                     ? 'bg-green-100 text-green-700'
//                     : 'bg-gray-200 text-gray-600'
//                 }`}
//               >
//                 {isActive ? 'Active' : 'Ended'}
//               </span>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }


// import { useEffect, useMemo, useRef, useState } from 'react'
// import { toast } from 'sonner'
// import { BarChart3, Users, Clock, TrendingUp } from 'lucide-react'





// function formatTimeRemaining(endTime, now) {
//   const diff = endTime - now
//   if (diff <= 0) return 'Ended'

//   const totalSeconds = Math.floor(diff / 1000)

//   const hours = Math.floor(totalSeconds / 3600)
//   const minutes = Math.floor((totalSeconds % 3600) / 60)
//   const seconds = totalSeconds % 60

//   if (hours > 0) {
//     return `Ends in ${hours}h ${minutes}m ${seconds}s`
//   }

//   if (minutes > 0) {
//     return `Ends in ${minutes}m ${seconds}s`
//   }

//   return `Ends in ${seconds}s`
// }



// export function VotingStats({ polls = [] }) {
//   // ⏱ second-precision clock
//   const [now, setNow] = useState(() => Date.now())

//   // Track which polls already triggered a toast
//   const notifiedPollsRef = useRef(new Set())

//   // Update every second
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setNow(Date.now())
//     }, 1000)

//     return () => clearInterval(interval)
//   }, [])

//   // 🔔 Toast when poll ends (fires ONCE per poll)
//   useEffect(() => {
//     polls.forEach(poll => {
//       if (poll.endTime <= now && !notifiedPollsRef.current.has(poll.id)) {
//         notifiedPollsRef.current.add(poll.id)

//         toast.success(`Poll ended`, {
//           description: poll.title
//         })
//       }
//     })
//   }, [polls, now])

//   const totalPolls = polls.length

//   const activePolls = useMemo(
//     () =>
//       polls.filter(
//         poll => poll.isActive && poll.endTime > now
//       ).length,
//     [polls, now]
//   )

//   const endedPolls = useMemo(
//     () =>
//       polls.filter(poll => poll.endTime <= now).length,
//     [polls, now]
//   )

//   const totalVotes = useMemo(
//     () => polls.reduce((sum, poll) => sum + poll.totalVotes, 0),
//     [polls]
//   )

//   const stats = [
//     { label: 'Total Polls', value: totalPolls, icon: BarChart3 },
//     { label: 'Active Polls', value: activePolls, icon: Clock },
//     { label: 'Total Votes', value: totalVotes, icon: Users },
//     { label: 'Completed', value: endedPolls, icon: TrendingUp }
//   ]

//   return (
//     <div className="space-y-8">
//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, index) => {
//           const Icon = stat.icon
//           return (
//             <div key={index} className="bg-gray-50 rounded-xl p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-600">{stat.label}</p>
//                   <p className="text-2xl font-bold">{stat.value}</p>
//                 </div>
//                 <Icon className="w-6 h-6 text-gray-700" />
//               </div>
//             </div>
//           )
//         })}
//       </div>

//       {/* ⏳ Live countdown list */}
//       <div className="space-y-3">
//         {polls.map(poll => {
//           const isActive = poll.endTime > now

//           return (
//             <div
//               key={poll.id}
//               className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
//             >
//               <div>
//                 <p className="font-medium">{poll.title}</p>
//                 <p className="text-xs text-gray-600">
//                   {poll.isActive
//                     ? formatTimeRemaining(poll.endTime, now)
//                     : 'Inactive'}
//                 </p>
//               </div>

//               <span
//                 className={`text-xs font-medium px-2 py-1 rounded ${
//                   isActive
//                     ? 'bg-green-100 text-green-700'
//                     : 'bg-gray-200 text-gray-600'
//                 }`}
//               >
//                 {isActive ? 'Active' : 'Ended'}
//               </span>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// import { BarChart3, Users, Clock, TrendingUp } from 'lucide-react'

// export function VotingStats({ polls }) {

//   const totalPolls = polls.length

//   const activePolls = polls.filter(
//     poll => poll.isActive && poll.endTime > Date.now()).length

//   const totalVotes = polls.reduce((sum, poll) => sum + poll.totalVotes, 0)

//   const endedPolls = polls.filter(poll => poll.endTime <= Date.now()).length


//   const stats = [
//     {
//       label: 'Total Polls',
//       value: totalPolls,
//       icon: BarChart3,
//       color: 'bg-blue-100 text-blue-600',
//       bgColor: 'bg-blue-50'
//     },
//     {
//       label: 'Active Polls',
//       value: activePolls,
//       icon: Clock,
//       color: 'bg-green-100 text-green-600',
//       bgColor: 'bg-green-50'
//     },
//     {
//       label: 'Total Votes',
//       value: totalVotes,
//       icon: Users,
//       color: 'bg-purple-100 text-purple-600',
//       bgColor: 'bg-purple-50'
//     },
//     {
//       label: 'Completed',
//       value: endedPolls,
//       icon: TrendingUp,
//       color: 'bg-orange-100 text-orange-600',
//       bgColor: 'bg-orange-50'
//     }
//   ]

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//       {stats.map((stat, index) => {
//         const Icon = stat.icon

//         return (
//           <div
//             key={index}
//             className={`${stat.bgColor} rounded-xl p-6 card-hover`}
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600 mb-1">
//                   {stat.label}
//                 </p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {stat.value.toLocaleString()}
//                 </p>
//               </div>
//               <div className={`p-3 rounded-lg ${stat.color}`}>
//                 <Icon className="w-6 h-6" />
//               </div>
//             </div>

//             {stat.label === 'Active Polls' && activePolls > 0 && (
//               <div className="mt-3 text-xs text-gray-600">
//                 {activePolls === 1 ? '1 poll' : `${activePolls} polls`} accepting votes
//               </div>
//             )}

//             {stat.label === 'Total Votes' && totalVotes > 0 && (
//               <div className="mt-3 text-xs text-gray-600">
//                 Avg {totalPolls > 0 ? Math.round(totalVotes / totalPolls) : 0} votes per poll
//               </div>
//             )}

//             {stat.label === 'Completed' && endedPolls > 0 && (
//               <div className="mt-3 text-xs text-gray-600">
//                 Results available for viewing
//               </div>
//             )}

//             {stat.label === 'Total Polls' && totalPolls > 0 && (
//               <div className="mt-3 text-xs text-gray-600">
//                 {Math.round((activePolls / totalPolls) * 100)}% currently active
//               </div>
//             )}
//           </div>
//         )
//       })}
//     </div>
//   )
// }
