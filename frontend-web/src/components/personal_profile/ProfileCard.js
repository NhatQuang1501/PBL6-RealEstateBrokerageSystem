// components/ProfileCard.js
import React from "react";

export default function ProfileCard() {
  return (
    <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg">
      {/* Profile Image */}
      <div className="mb-4 flex justify-center">
        <img
          src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b514e3cf-d394-43fb-be65-1711518576b6/dfn0ve3-906de5ab-99c9-4b44-bea6-93871c92b44c.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2I1MTRlM2NmLWQzOTQtNDNmYi1iZTY1LTE3MTE1MTg1NzZiNlwvZGZuMHZlMy05MDZkZTVhYi05OWM5LTRiNDQtYmVhNi05Mzg3MWM5MmI0NGMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.cg82kq5m0-7VH5b2LoFAUEdWLsLTcdczzsB_nFBjH44"
          alt="profile"
          className="rounded-full"
        />
      </div>

      {/* Contact Button */}
      <button className="bg-teal-500 px-4 py-2 rounded-lg w-full mb-4">
        Contact Me
      </button>

      {/* Face Customizer Options */}
      <div>
        <p className="mb-2">Face Customizer</p>
        <div className="flex flex-col">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Graphic & Web Designer
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Motion Designer
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Webflow Expert
          </label>
        </div>
      </div>
    </div>
  );
}
