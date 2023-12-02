import '../styles/App.css';
import {useEffect, useState} from "react";

const Splash = ({ show = true }) => {
    const [ hidden, setHidden ] = useState(false)
    const [ welcomeMessage, setWelcomeMessage ] = useState('')

    useEffect(()=>{
        if (!show)
            setWelcomeMessage(getWelcomeMessage())
            setTimeout(() => {
                setHidden(true)
            }, 3000);
    }, [show])

    const getWelcomeMessage = () => {
        const set = [
            'Harder than last time!',
            'Light weight!',
            'No pain, no gain!',
            "You're dereferencing a nullpointer!",
            'Yeah buddy!',
            'Good f*ing morning, god damn it!',
            'Stick to the program!',
            "You're a sick c*nt!",
            "We're all gonna make it!",
            'Everything is hard before it is easy!',
            'Keff Javaliere, AthleanY.net!',
            'Reps for Jesus!',
            "He's curling in the squat rack already. - Dom Mazzetti",
            "Chasing the pump!",
            "More than 40.000 lines of code!",
            "Securing gainz since 2020!",
            "Go hard, mate. The gym lifestyle is the best!",
            "Everyone has a little bit of Zyzz in them.",
            "The real workout starts when you want to stop",
            "Suffer now and live the rest of your life as a champion",
            "We love casting spells!",
            ''
        ]
        return set[Math.floor(Math.random() * set.length)];
    }

    return (
        hidden ? null :
        <section className={ `page-wrapper splash ${ !show && 'fade-out-image' }` }>
            <div className={'content-wrapper'} style={{textAlign: 'center'}}>
                <div className={`text-wrapper ${ !show && 'zoom-in' }`}>
                    <h2 className={'glitch'} data-text={"GAINZ TRACKER"}>GAINZ TRACKER</h2>
                    <p style={ messageStyle }> { welcomeMessage } </p>
                </div>
            </div>
            {<p style={footerText}>© Erik Sänne 2020-{new Date().getFullYear()} </p>}
        </section>
    );
}

const messageStyle = {
    filter: 'drop-shadow(0px 0px 5px #000)'
}

const footerText = {
    position: 'fixed',
    bottom: '0px',
    right: '15px',
    zIndex: 99
}

export default Splash;