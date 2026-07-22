import React from 'react'

const ProfileCard = ({ person }) => {
  const { firstName, lastName, age, gender, mobile, email } = person
  const fullName = firstName + " " + lastName
  const seed = firstName.toLowerCase() + lastName.toLowerCase()
  const imgUrl = "https://api.dicebear.com/7.x/shapes/svg?seed=" + seed

  return (
    <div className="profile-card">
      <img className="profile-img" src={imgUrl} alt={fullName} />
      <h2>{fullName}</h2>
      <p><strong>Age:</strong> {age}</p>
      <p><strong>Gender:</strong> {gender}</p>
      <p><strong>Mobile:</strong> {mobile}</p>
      <p><strong>Email:</strong> {email}</p>
    </div>
  )
}

export default ProfileCard
