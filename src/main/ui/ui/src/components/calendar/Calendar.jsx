import React from "react";
import '../../styles/calendar.css';
import Loader from "../ui_components/Loader";

const day = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]

const Calendar = ({resources, events, days, scrollCallback}) => {
    const slider = React.createRef();

    const handleScroll = (event) => {
        const left = event.target.scrollWidth - event.target.offsetWidth + event.target.scrollLeft;
        if (scrollCallback && left < 5) {
            scrollCallback();
        }
    }

    const handleWheel = (event) => {
        slider.current.scrollLeft = slider.current.scrollLeft + event.deltaY
    }

    const dates = getDates(days)
    return (
        <div className={'calendar'}>
            <div className={'resources'}>
                <div className={ 'day' }>
                    <div className={ 'day-header' } style={{ border: '0px' }}> </div>
                    {resources.map((resource, key) =>
                    <div className={ 'resource resource-container' } key={key}>
                        <span>{ resource.name }</span>
                    </div>
                    )}
                    <div className={ 'day-margin' }></div>
                </div>
            </div>
            <div className={ 'calendar-view' } onScroll={ handleScroll } onWheel={ handleWheel } ref={slider}>
                {dates.map((date, keyDay) =>
                    <div className={'day'} key={'day_'+keyDay}>
                        <div className={ 'day-header' }>
                            { date.displayAsText ? `${day[date.date.getDay()]}` : `${date.date.getDate()}/${date.date.getMonth() + 1}` }
                        </div>
                        { resources.map((resource, keyResource) =>
                        <div className={ 'resource-container' } key={ 'resource_'+keyResource }>
                            {events.filter(e => e.resourceId === resource.id && sameDate(e.date, date.date.toDateString())).map((event, keyEvent) =>
                                <div className={ `event ${event.text.toLowerCase()}` } key={ 'event_'+keyEvent }>
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
                <div className={'day loader'} key={'day_loader'}>
                    <Loader />
                </div>
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
        days.push({date: date, displayAsText: i < 14});
    }
    return days;
}

export default Calendar;