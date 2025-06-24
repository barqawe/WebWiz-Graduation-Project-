import Style from "./Intro.module.scss"; 

export default function Intro() {   
  return (     
    <>       
      <div className={Style.IntroContainer}>         
        <h1 className={Style.fancyText}>
          <span className={Style.gradientLetter}>W</span>
          <span className={Style.gradientLetter}>e</span>
          <span className={Style.gradientLetter}>b</span>
          <span className={Style.gradientLetter}>W</span>
          <span className={Style.gradientLetter}>i</span>
          <span className={Style.gradientLetter}>z</span>
        </h1>         
        <p className={Style.aboutText}>           
          Master Front-End Development with Interactive Challenges         
        </p>
        <div className={Style.codeBlocks}>
          <span className={Style.codeBlock}>&lt;html&gt;</span>
          <span className={Style.codeBlock}>&lt;css&gt;</span>
          <span className={Style.codeBlock}>&lt;js&gt;</span>
          <span className={Style.codeBlock}>&lt;react&gt;</span>
        </div>
      </div>     
    </>   
  ); 
}
