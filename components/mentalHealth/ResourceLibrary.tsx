import React from 'react'

export function ResourceLibrary() {
  return (
    <div className="resource-library-container">
      <strong>Here are some resources on mental health:</strong><br/><br/>
      <strong> Canada-wide services:</strong> 
      <ul>
        <li> <a href="https://www.canada.ca/en/health-canada/services/substance-use/get-help-with-substance-use.html" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'blue'}}>Get help with substance use</a> </li>  
        <li> <strong> Centre for Addiction and Mental Health (CAMH):</strong> <a href="https://moodle8.camhx.ca/moodle/" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'blue'}}>Free online courses</a> </li> 
        <li> <strong> Canadian Mental Health Association (CMHA)s:</strong> <a href="https://cmha.ca/find-info/mental-health/general-info/" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'blue'}}>Mental health resources</a> </li> 
      </ul> <br/>
      <strong>Anxiety:</strong> 
      <ul>
        <li> <a href="https://adaa.org/understanding-anxiety" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'blue'}}>Anxiety and Depression Association of America</a> </li>
        <li> <a href="https://www.helpguide.org/articles/stress/stress-management.htm" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'blue'}}>Managing Stress</a></li>
        <li> Getting to Know Your Brain: Dealing with Stress:
        <iframe
          width="550"
          height="350"
          src={`https://www.youtube.com/embed/sTpo1FuYQ9I`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video"
        ></iframe></li>
        <li> Guided Visualization: Dealing with Stress:
        <iframe
          width="550"
          height="350"
          src={`https://www.youtube.com/embed/Dq9odPtHbcg`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video"
        ></iframe></li>
      </ul> <br/>
      <strong>Depression:</strong> 
      <ul>
        <li> Behavioral Activation: Treatment of Adolescent Depression:
        <iframe
          width="550"
          height="350"
          src={`https://www.youtube.com/embed/1R6-gLZZhYc`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video"
        ></iframe></li>
        <li> <a href="https://www.nimh.nih.gov/health/topics/depression/index.shtml" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'blue'}}>Coping with Depression</a></li>
      </ul> <br/>
      <strong>ADHD:</strong> 
      <ul>
        <li> Mental Health Minute: Attention-Deficit/Hyperactivity Disorder
        <iframe
          width="550"
          height="350"
          src={`https://www.youtube.com/embed/-j2PqoFCzX0`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video"
        ></iframe></li>
      </ul> <br/>
      <strong>Eating Disorders:</strong> 
      <ul>
        <li> Mental Health Minute:
        <iframe
          width="550"
          height="350"
          src={`https://www.youtube.com/embed/_yM7_hbpRXc`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video"
        ></iframe></li>
      </ul> <br/>
      <strong>Bipolar Disorder:</strong> 
      <ul>
        <li> Mental Health Minute: Bipolar Disorder in Adults
        <iframe
          width="550"
          height="350"
          src={`https://www.youtube.com/embed/lOhelfEDAzs`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video"
        ></iframe></li>
      </ul> <br/>
      <strong> Mindfulness Meditation:</strong> 
      <ul>
        <li> Watch a video on mindfulness meditation:
      <iframe
        width="550"
        height="350"
        src={`https://www.youtube.com/embed/inpok4MKVLM`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video"
      ></iframe></li>
      </ul>
    </div>
  )
}
