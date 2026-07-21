function Footer() {
  const links = [
    "Help", "Status", "About", "Careers",
    "Press", "Blog", "Privacy", "Rules",
    "Terms", "Text to speech"
  ]

  return (
    <footer>
      {links.map((link, index) => (
        <a href="#" key={index}>{link}</a>
      ))}
    </footer>
  )
}

export default Footer
