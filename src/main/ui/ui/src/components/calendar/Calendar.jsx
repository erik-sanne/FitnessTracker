import React from "react";
import '../../styles/calendar.css';

const day = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]

const Calendar = ({resources, events}) => {
    const dates = getDates(14)
    return (
        <div className={'calendar'}>
            <div className={'resources'}>
                <div className={ 'day' }>
                    <div className={ 'day-header' } style={{ border: '0px' }}> </div>
                    {resources.map((resource, key) =>
                    <div className={ 'resource resource-container' } key={key}>
                        <span>{ resource.text }</span>
                    </div>
                    )}
                    <div className={ 'day-margin' }></div>
                </div>
            </div>
            <div className={ 'calendar-view' }>
                {dates.map((date, keyDay) =>
                    <div className={'day'} key={'day_'+keyDay}>
                        <div className={ 'day-header' }>
                            { day[date.getDay()] }
                        </div>
                        {resources.map((resource, keyResource) =>
                        <div className={ 'resource-container' } key={ 'resource_'+keyResource }>
                            {events.filter(e => e.resourceId === resource.id && sameDate(e.date, date.toDateString())).map((event, keyEvent) =>
                                <div className={ 'event' }>
                                    <span>
                                        { event.text }
                                    </span>
                                </div>
                            )}
                        </div>
                        )}
                        <div className={ 'day-margin' }></div>
                    </div>
                )}
            </div>
        </div>
    )
}

const sameDate = (datestring1, datestring2) => {
    const d1 = new Date(datestring1);
    const d2 = new Date(datestring2);
    return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
}

const getDates = (numberOfDays) => {
    const days = [];

    for (let i = 0; i < numberOfDays; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i)
        days.push(date);
    }
    return days;
}

export default Calendar;