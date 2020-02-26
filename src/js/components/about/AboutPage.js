import React from 'react'

const AboutPage = (props) => {

  return (
    <div className="about-wrapper">
      <div className="about-inner-wrapper">
        <img className="about-profile-picture" src="/images/portrait.jpg" alt="Professional portrait." />
        <div className="about-text">
          I'm a game developer and full-stack engineer from Rochester, NY and graduated from Rochester Institute of Technology in Game Design and Development. I've been working in games since 2011 and web since 2013. I focus on implementing highly efficient and scalable code that's easy to maintain and read. While I worked at EmployeeChannel I lead the team's efforts in researching and implementing automated QA technologies as well as updating the code base to ensure standard coding practices across the stack. I also focused heavily in ensuring our front-end matched our user-focused designs. After work I continue to develop and design new and innovative games focused on providing players with new ways to interact and play games. This led me to ideas like <i>Iron Atlas</i> and <i>Project Smith</i>, and now my current project of <i>RealPlates</i>.
        </div>
        <div className="about-text">
          Outside of work I'm an avid hiker, rock climber, and outdoorsman, finding inspiration and motivation through nature.
        </div>
      </div>
    </div>
  )
}

export default AboutPage