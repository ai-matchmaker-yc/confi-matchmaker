import MatchList from '@/components/matches/MatchList'

export default function MatchesPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Your Matches</h1>
      <MatchList />
    </div>
  )
}