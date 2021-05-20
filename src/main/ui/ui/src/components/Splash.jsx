import '../styles/App.css';

const Splash = ({ show = true }) => {
    return (
        <section className={ `page-wrapper splash ${ !show && 'fade-out-image' }` }>
            <div className={'content-wrapper'} style={{textAlign: 'center'}}>
                <div className={`text-wrapper ${ !show && 'zoom-in' }`}>
                    <h2 className={'glitch'} data-text={"GAINZ TRACKER"}>GAINZ TRACKER</h2>
                </div>
            </div>
            {show && <p style={footerText}>© Erik Sänne | 2020 </p>}
        </section>
    );
}

const footerText = {
    position: 'fixed',
    bottom: '0px',
    right: '15px'
}

export default Splash;