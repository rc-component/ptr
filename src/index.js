import React, { Component, PropTypes } from 'react'
import ReactDom from 'react-dom'
import style from './style.css'
import Spinner from 'rc-ispinner'
import cx from 'classnames'
import once from 'once'
import classes from 'classes'

const STAGE_INIT = 0
const STAGE_ROTATE = 1
const STAGE_LOADING = 2

export default class Ptr extends Component {
  static defaultProps = {
    spinner: true
  }
  static propTypes = {
    spinner: PropTypes.bool,
    callback: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      stage: STAGE_INIT
    }
  }
  componentDidMount() {
    let el = ReactDom.findDOMNode(this)
    let scrollable = this.scrollable = findScrollable(el)
    if (!this.scrollable) throw new Error('scrollable element not found')
    scrollable.addEventListener('scroll', this.onscroll, false)
    document.addEventListener('touchend', this.ontouchend)
  }
  componentWillUnmount() {
    if (this.scrollable) {
      this.scrollable.removeEventListener('scroll', this.onscroll, false)
      document.removeEventListener('touchend', this.ontouchend)
    }
  }
  render() {
    let children
    let stage = this.state.stage
    if (stage === STAGE_LOADING) {
      if (this.props.spinner) {
        children = <Spinner type="gray" width={20}/>
      } else {
        children = this.props.children
      }
    } else {
      children = null
    }
    let className = cx({
      [style.image]: stage == STAGE_INIT || stage == STAGE_ROTATE,
      [style.rotate]: stage == STAGE_ROTATE,
      [style.center]: stage == STAGE_LOADING
    })
    return (
      <div className={style.ptr}>
        <div className={className}>
          {children}
        </div>
      </div>
    )
  }
  onscroll = e => {
    e.preventDefault()
    let state = this.state
    if (state.stage === STAGE_LOADING) return
    var top = this.scrollable.scrollTop
    if (top > -30) {
      this.setState({
        stage: STAGE_INIT
      })
    }
    else if (top < -30) {
      this.setState({
        stage: STAGE_ROTATE
      })
    }
  }
  refresh () {
    this.setState({
      stage: STAGE_LOADING
    })
    let scrollable = this.scrollable
    scrollable.scrollTop = -30
    let self = this
    let cb = once(function () {
      scrollable.scrollTop = 0
      self.setState({
        stage: STAGE_INIT
      })
    })
    let res = this.props.callback(cb)
    if (res && typeof res.then === 'function') {
      res.then(cb, cb)
    }
  }
  ontouchend = e => {
    if (this.state.stage === STAGE_ROTATE) {
      e.stopImmediatePropagation()
      this.refresh()
    }
  }
}

let body = document.body
function findScrollable (el) {
  while(el) {
    el = el.parentNode
    if (classes(el).has('scrollable')) return el
    if (el === body) return null
  }
}
