import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Ptr from '../index';
import Iscroll from 'rc-iscroll'
import style from './style.css'

const boxStyles = {
  width: 100,
  height: 300,
  position: 'relative'
}

function callback() {
  return new Promise(function (resolve) {
    setTimeout(resolve, 3000)
  })
}

storiesOf('Ptr', module)
  .add('spinner', () => {
    return (
      <Iscroll overflow={45}
        barClass={style.handlebar}
        style={{...boxStyles}}>
        <Ptr callback={callback}/>
        <div style={{height: 200, backgroundColor: '#eee'}}/>
      </Iscroll>
  )})
  .add('text', () => {
    return (
      <Iscroll overflow={45} style={{...boxStyles}}>
        <Ptr spinner={false} callback={callback}>
          <div style={{textAlign: 'center'}}>loading</div>
        </Ptr>
        <div style={{height: 200, backgroundColor: '#eee'}}/>
      </Iscroll>
  )})
