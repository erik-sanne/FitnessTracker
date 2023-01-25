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
    const [achievements, setAchievements] = useState({});

    useEffect(() => {
        get('/api/achievements').then(achievements => {
            const all = achievements.map(a => {return {
                name: a.name,
                description: a.date ? a.description : "",
                type: a.type,
                date: a.date ? a.date.split('T')[0] : "",
                achieved: a.date ? true : false
            }});

            const res = all.reduce((map, a) => {
                map[a.type] = [...map[a.type] || [], a];
                return map;
                }, {})
            setAchievements(res);
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

    if (achievements.length === 0)
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
                {Object.entries(achievements).map(([type, achievements]) =>
                    <div key={ type }>
                        <p style={{ margin: '1em'}}>
                            { type }
                        </p>
                        { achievements.map((achievement, idx) =>
                            <Accordion square key={type+"_"+idx} style={{ background: '#282c3400', color: 'inherit', boxShadow: '0px 0px 10px #00000060', border: '1px solid #cccccc10' }} disabled={ !achievement.achieved }>
                                <AccordionSummary aria-controls={`${idx}-content`} id={`${idx}-header`} style={{ color: achievement.achieved ? "#fff" : "#aaa"}}>
                                    <span>{ achievement.name }</span>
                                    <span style={{ flex: 1 }}> </span>
                                    <span>{ achievement.date }</span>
                                </AccordionSummary>
                                { achievement.achieved &&
                                    <AccordionDetails style={{display: 'block'}}>
                                        <p>{achievement.description}</p>
                                        {
                                            <TextButton mini onClick={() => setTitle(achievement.name)} disabled={userProfile.title === achievement.name}>
                                                {userProfile.title !== achievement.name ? "Set as display title" : "Current display title"}
                                            </TextButton>
                                        }
                                    </AccordionDetails>
                                }
                            </Accordion>
                            )}
                    </div>
                )}
            </Module>
        </div>
    )
}

export default SectionAchievements;
