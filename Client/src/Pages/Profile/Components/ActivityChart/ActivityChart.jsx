import React, { useState, useEffect , useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto'

import "./ActivityChart.scss"

function ActivityChart({postDates , replyDates}){

    const [chartData , setChartData] = useState(null)
    const [granularity, setGranularity] = useState('monthly');

    useEffect(() => {
        const formatedData = formatChartData(postDates , replyDates , granularity)

        setChartData(formatedData)
    } , [granularity , postDates , replyDates])




    const formatChartData = (postDates , replyDates , granularity) => {

        const postGroupedData = groupDataByGranularity(postDates , granularity , setDateIntervals())
        const replyGroupedData = groupDataByGranularity(replyDates , granularity , setDateIntervals())


        const labels = Object.keys(postGroupedData)

        const postData = Object.values(postGroupedData)
        const replyData = Object.values(replyGroupedData)

        

        const chartData = {
            labels : labels,
            datasets : [
                {
                    label : "Posts Written",
                    data : postData,
                    borderColor: 'hsl(238, 40%, 52%)',
                    borderWidth: 2, 
                    fill : false
                },
                {
                    label : "Replies Written",
                    data : replyData,
                    borderColor: 'hsl(207, 37%, 52%)',
                    borderWidth: 2,
                    fill : false
                }
            ]
        }

        return chartData
    }

    const setDateIntervals = () => {
        const currentDate = new Date();
        const startDate = new Date(2023, 0, 1);
      
        const dateIntervals = [];
        let currentDatePointer = new Date(startDate);
      
        while (currentDatePointer <= currentDate) {
          dateIntervals.push(new Date(currentDatePointer));
          if (granularity === 'daily') {
            currentDatePointer.setDate(currentDatePointer.getDate() + 1);
          } else if (granularity === 'weekly') {
            currentDatePointer.setDate(currentDatePointer.getDate() + 7);
          } else if (granularity === 'monthly') {
            currentDatePointer.setMonth(currentDatePointer.getMonth() + 1);
          } else {
            currentDatePointer.setFullYear(currentDatePointer.getFullYear() + 1);
          }
        }
      
        const updatedDateIntervals = dateIntervals.reduce((acc, chartDate) => {
            let key;
        
            if (granularity === 'weekly') {
              const days = Math.floor((chartDate - startDate) / (24 * 60 * 60 * 1000));
              const weekNumber = Math.ceil(days / 7);
              key = `${chartDate.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
            } else if (granularity === 'monthly') {
              key = `${chartDate.getFullYear()}-${String(chartDate.getMonth() + 1).padStart(2, '0')}`;
            } else if (granularity === 'yearly') {
              key = `${chartDate.getFullYear()}`;
            } else {
              key = `${chartDate.getFullYear()}-${String(chartDate.getMonth() + 1).padStart(2, '0')}-${String(chartDate.getDate()).padStart(2, '0')}`;
            }
        
            acc[key] = 0;
        
            return acc;
          }, {});

          return updatedDateIntervals
    }

    const groupDataByGranularity = (dates, granularity , dateIntervals) => {
        dates.forEach((textDate) => {
          const chartDate = new Date(textDate);
          const startDate = new Date(2023 , 0, 1);
      
          let key;
      
          if (granularity === 'weekly') {
            const days = Math.floor((chartDate - startDate) / (24 * 60 * 60 * 1000));
            const weekNumber = Math.ceil(days / 7);
            key = `${chartDate.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
          } else if (granularity === 'monthly') {
            key = `${chartDate.getFullYear()}-${String(chartDate.getMonth() + 1).padStart(2, '0')}`;
          } else if (granularity === 'yearly') {
            key = `${chartDate.getFullYear()}`;
          } else {
            key = `${chartDate.getFullYear()}-${String(chartDate.getMonth() + 1).padStart(2, '0')}-${String(chartDate.getDate()).padStart(2, '0')}`;
          }
      
          dateIntervals[key] += 1;
        });
      
        return dateIntervals;
      };
      
    
    if(!chartData) return null



    return (<>
        <select defaultValue={granularity} onChange={(event) => setGranularity(event.target.value)}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
        </select>

        <Line data={chartData}/>
    </>)
}

export default ActivityChart