import React from 'react'
import ProfileCard from './ProfileCard.jsx'

const people = [
  {
    firstName: "Simran",
    lastName: "Kaur",
    age: 21,
    gender: "Female",
    mobile: "9876543210",
    email: "simran.kaur@example.com"
  },
  {
    firstName: "Aditya",
    lastName: "Sharma",
    age: 23,
    gender: "Male",
    mobile: "9812345678",
    email: "aditya.sharma@example.com"
  },
  {
    firstName: "Neha",
    lastName: "Verma",
    age: 20,
    gender: "Female",
    mobile: "9900112233",
    email: "neha.verma@example.com"
  },
  {
    firstName: "Rohit",
    lastName: "Mehta",
    age: 25,
    gender: "Male",
    mobile: "9765432109",
    email: "rohit.mehta@example.com"
  },
  {
    firstName: "Ananya",
    lastName: "Singh",
    age: 22,
    gender: "Female",
    mobile: "9654321098",
    email: "ananya.singh@example.com"
  },
  {
    firstName: "Karan",
    lastName: "Chauhan",
    age: 24,
    gender: "Male",
    mobile: "9543210987",
    email: "karan.chauhan@example.com"
  }
]

const ProfileList = () => {
  return (
    <section>
      <h2>Profile Cards</h2>
      <div className="card-grid">
        {people.map((person, index) => (
          <ProfileCard key={index} person={person} />
        ))}
      </div>
    </section>
  )
}

export default ProfileList
