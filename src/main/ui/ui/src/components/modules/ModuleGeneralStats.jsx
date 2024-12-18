import '../../styles/Module.css';
import React from "react";
import Loader from "../ui_components/Loader";
import useFetch from "../../services/useFetch";
import DisplayValue from "./DisplayValue";
import ModuleExerciseDistribution from "./ModuleExerciseDistribution";
import ModuleSplitRatios from "./ModuleSplitRatios";
import SwiperWrapper from "../ui_components/swiper/SwiperWrapper";
import {SwiperSlide} from "swiper/react";
import ModuleWorkoutDistributionOverTime from "./ModuleWorkoutDistributionOverTime";

const ModuleGeneralStats = () => {
    const { data, loading } = useFetch('/api/workouts');

    return (<div style={{height: 'min(65vw, 500px)', margin: '-1.5rem -1rem -1.5rem -1rem', borderRadius: '1rem' }} className={'primary-content-wrapper'}>
                <SwiperWrapper touchStartPreventDefault={false}>
                    <SwiperSlide>
                        <div className={ 'swiper-page' }>
                            <ModuleSplitRatios />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className={ 'swiper-page' }>
                            <ModuleWorkoutDistributionOverTime />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className={ 'swiper-page' }>
                            <ModuleExerciseDistribution />
                        </div>
                    </SwiperSlide>
                </SwiperWrapper>
                {
                    loading ? <Loader /> :
                    <div style={{ display: "flex", padding: "0.8rem 1rem" }}>
                        <DisplayValue text={'Push'} value={ data.filter(s => s.description === "PUSH").length } style={{ width: "4rem" }}/>
                        <DisplayValue text={'Pull'} value={ data.filter(s => s.description === "PULL").length } style={{ width: "4rem" }}/>
                        <DisplayValue text={'Legs'} value={ data.filter(s => s.description === "LEGS").length } style={{ width: "4rem" }}/>
                    </div>
                }
            </div>)
}


export default ModuleGeneralStats;