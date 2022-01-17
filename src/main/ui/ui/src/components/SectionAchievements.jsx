import React, {useEffect, useState} from "react";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Accordion from "@material-ui/core/Accordion";
import get from "../services/Get";
import Module from "./modules/Module";

const SectionAchievements = () => {
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

    if (achieved.length === 0 || nonAchieved.length === 0 )
        return <></>

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
