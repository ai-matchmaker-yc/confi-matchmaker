"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const SchedulePage = () => {
  return (
    <div className="w-full mt-32">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Hackathon Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Friday */}
          <div>
            <h2 className="text-xl font-bold mb-4">Friday Nov 22</h2>
            <ul className="space-y-3">
              <li className="flex gap-4">
                <span className="font-semibold min-w-[80px]">5:30PM</span>
                <span>Doors open + dinner served</span>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold min-w-[80px]">6:00PM</span>
                <span>Intros</span>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold min-w-[80px]">6:15PM</span>
                <span>Idea pitching + team formation (if you aren't already on a team)</span>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold min-w-[80px]">7:15PM</span>
                <span>Hacking</span>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold min-w-[80px]">11:59PM</span>
                <span>Closed for the evening</span>
              </li>
            </ul>
          </div>

          {/* Saturday */}
          <div>
            <h2 className="text-xl font-bold mb-4">Sat Nov 23</h2>
            <ul className="space-y-3">
              <li className="flex gap-4">
                <span className="font-semibold min-w-[80px]">9:00AM</span>
                <span>Doors open, hacking resumes + light breakfast served</span>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold min-w-[80px]">12:00PM</span>
                <span>Lunch served</span>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold min-w-[80px]">4:00PM</span>
                <span>Code freeze</span>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold min-w-[80px]">4:15PM</span>
                <span>Judging semi finals</span>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold min-w-[80px]">6:00PM</span>
                <span>Dinner and drinks</span>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold min-w-[80px]">6:30PM</span>
                <span>Ten finalists announced</span>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold min-w-[80px]">7:00PM</span>
                <span>Finalists present</span>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold min-w-[80px]">8:25PM</span>
                <span>Winners announced</span>
              </li>
              <li className="flex gap-4">
                <span className="font-semibold min-w-[80px]">9:30PM</span>
                <span>Hackathon ends</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SchedulePage