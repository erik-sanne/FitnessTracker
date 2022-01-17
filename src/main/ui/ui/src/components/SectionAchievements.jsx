import React, {useEffect, useState} from "react";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Accordion from "@material-ui/core/Accordion";
import get from "../services/Get";
import Module from "./modules/Module";
import Loader from "./ui_components/Loader";
import TextButton from "./ui_components/TextButton";
import {getCookie} from "react-use-cookie";

const SectionAchievements = ({userProfile, updateUserProfile}) => {
    const [achieved, setAchieved] = useState([]);
    const [nonAchieved, setNonAchieved] = useState([]);

    useEffect(() => {
        get('/api/achievements').then(achievements => {
            const all = achievements.map(a => {return {
                name: a.name,
                description: a.date ? a.description : "",
                date: a.date ? a.date.split('T')[0] : "",
                achieved: a.date ? true : false
            }});
            setAchieved(all.filter(a => a.achieved));
            setNonAchieved(all.filter(a => !a.achieved));
        })
    }, []);

    const setTitle = (title) => {

        const token = getCookie('session_token')
        fetch(`${process.env.REACT_APP_API_BASE}/users/setTitle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${token}`
            },
            body: title
        }).then(() => {
            updateUserProfile();
        });
    }

    if (achieved.length === 0 || nonAchieved.length === 0 )
        return (
            <div className={ 'page-wrapper' } style={{ justifyContent: 'normal'}}>
                    <Module title = "Achievements">
                        <Loader />
                    </Module>
            </div>
        );

    return (
        <div className={ 'page-wrapper' } style={{ justifyContent: 'normal'}}>
            <Module title = "Achievements">
                <p>My Achievements</p>
                {achieved.map((achievement, idx) =>
                    <Accordion square key={idx} style={{ background: '#282c3400', color: 'inherit', boxShadow: '0px 0px 10px #00000060', border: '1px solid #cccccc10' }}>
                        <AccordionSummary aria-controls={`${idx}-content`} id={`${idx}-header`} style={{ color: achievement.achieved ? "#fff" : "#aaa"}}>
                            <span>{ achievement.name }</span>
                            <span style={{ flex: 1 }}> </span>
                            <span>{ achievement.date }</span>
                        </AccordionSummary>
                        <AccordionDetails style={{ display: 'block'}}>
                            <p>{ achievement.description }</p>
                            { <TextButton mini onClick={ () => setTitle(achievement.name) } disabled={ userProfile.title === achievement.name }>{ userProfile.title !== achievement.name ? "Set as display title" : "Current display title" }</TextButton>}
                        </AccordionDetails>
                    </Accordion>
                )}
                <br/>
                <p>Locked Achievements</p>
                {nonAchieved.map((achievement, idx) =>
                    <Accordion square key={idx} style={{ background: '#282c3400', color: 'inherit', boxShadow: '0px 0px 10px #00000060', border: '1px solid #cccccc10' }} disabled>
                        <AccordionSummary aria-controls={`${idx}-content`} id={`${idx}-header`} style={{ color: achievement.achieved ? "#fff" : "#aaa"}}>
                            <span>{ achievement.name }</span>
                        </AccordionSummary>
                    </Accordion>
                )}
            </Module>
        </div>
    )
}

export default SectionAchievements;
