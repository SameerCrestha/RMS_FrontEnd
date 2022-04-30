import React ,{useEffect}from 'react';
import './Home.css';
function Home(props) {
    useEffect(() => {
        const script = document.createElement('script');
      
        script.src = "https://nepalipatro.com.np/np-widgets/nepalipatro.js";
        script.id="wiz1"
        script.async = true;
      
        document.body.appendChild(script);
      
        return () => {
          document.body.removeChild(script);
        }
      }, []);
    return (
        <div className='home'>
            <div className='text1'>Welcome to restaurant management system</div>
           <div className='widget' id="np_widget_wiz1" widget="day" ></div>
           <div className='text2'>&copy;Aaditya Dulal 2022</div>
        </div>
    );
}

export default Home; 