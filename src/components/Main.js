require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDom from 'react-dom'

// 获取图片相关数
const imageDatas = require('../data/imageDatas.json')


class ImgFigure extends React.Component {
	constructor(props) {
		super(props)
	}
	handleClick = (event) => {
		event.preventDefault()
		event.stopPropagation()
		if (!this.props.isCenter){
			this.props.center(this.props.index)
		} else {
			this.props.inverse(this.props.index)
		}
	}
	render() {
		let styleObj = {}
		if (this.props.pos) {
			styleObj = {
				left: this.props.pos.left + 'px',
				top: this.props.pos.top + 'px'
			}
		}
		if (this.props.rotate) {
			let arr = ['MozT', 'msT', 'WebkitT', 't']
			arr.forEach((value) => {
				styleObj[value + 'ransform'] = 'rotate(' + this.props.rotate + 'deg)'
			})
			// styleObj['transform'] = 'rotate(' + props.rotate + 'deg)'
		}
		let ImgFigureClassName = 'img-figure'
		ImgFigureClassName += this.props.isInverse ? ' is-inverse' : ''
		return (
			<figure className={ImgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.imgSrc} alt={this.props.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.title}</h2 >
					<div className="img-back" onClick={this.handleClick}>
					  <p>
						{this.props.text}
					  </p>
					</div>
				</figcaption>
			</figure>
		)
	}
}

// class ControllerUnit extends React.Component {
// 	constructor(props) {
// 		super(props)
// 	}
// 	handleClick = (event) => {
// 		event.preventDefault()
// 		event.stopPropagation()
// 		this.props.controllerClick()
// 	}
// 	render() {
// 		return (
// 			<span className="controller-unit"></span>
// 		)
// 	}
// }

function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low)
}

function get30DegRandom() {
	return (Math.random() > 0.5 ? '' : '-') + (Math.random()*30)
}

/**
 * 随机得到数组中的元素的下标
 * @method getRandomArrayElements
 * @param  {[type]}               arr   [description]
 * @param  {[type]}               count [description]
 * @return {[type]}                     [description]
 */
function getRandomArrayElements(arr, count, otherArr) {
	let shuffled = arr.slice(0) //复制一份
	let len = shuffled.length
	let temArr = []
	let randomIndex = () => {
		return Math.floor((len) * Math.random())
	}
	let judge = (index) => {
		return temArr.filter(item => item === index).length > 0 || otherArr.filter(item => item === index).length > 0
	}
	while(count-- > 0) {
		let index
		do {
			index = randomIndex()
		} while (judge(index));
		temArr.push(index)
	}
	return temArr
}

class AppComponent extends React.Component {
  constructor(props) {
	  super(props)
	  this.state = {
		  Constant: {
			centerPos: {
				left: 0,
				right: 0
			},
			hPosRange: { //水平方向的取值范围
				leftSecX: [0, 0],
				rightSecX: [0, 0],
				y: [0, 0]
			},
			vPosRange: { // 垂直方向的取值范围
				x: [0, 0],
				topY: [0, 0]
			}
		},
		imgsArrangeArr: [
		]
	  }
  }
 /**
  * 翻转图片
  * @param index 输入当前被执行inverse 操作的图片对应的图片信息数组的index 值
  * @method inverse
  * @return function 闭包
  */
  inverse = (index) => {
	  this.state.imgsArrangeArr[index].isInverse = !this.state.imgsArrangeArr[index].isInverse
	  this.setState({
		  imgsArrangeArr: this.state.imgsArrangeArr
	  })
	console.log(index, 'click')
  }

  center = (index) => {
	 this.rearrange(index)
  }

  // ControllerUnitHandler = (index) => {
  //  this.rearrange(index)
  // }

  // 重新排布 指定居中排布哪个图片
  rearrange = (centerIndex) => {
	  let otherArr = []

	  // 中心图片 centerIndex 处理
	  this.state.imgsArrangeArr[centerIndex].pos = this.state.Constant.centerPos
	  this.state.imgsArrangeArr[centerIndex].isCenter = true
	  this.state.imgsArrangeArr[centerIndex].rotate = 0

	  otherArr.push(centerIndex)
	  // 上侧图片 1 / 2 张
	  let topImgNum = Math.ceil(Math.random() * 2)
	  let topArr = getRandomArrayElements(this.state.imgsArrangeArr, topImgNum, otherArr)
	  console.log('topArr', topArr)

	  topArr.forEach(index => {
		  this.state.imgsArrangeArr[index].pos = {
			  top: getRangeRandom(this.state.Constant.vPosRange.topY[0], this.state.Constant.vPosRange.topY[1]),
			  left: getRangeRandom(this.state.Constant.vPosRange.x[0], this.state.Constant.vPosRange.x[1])
		  }
		  this.state.imgsArrangeArr[index].rotate = get30DegRandom()
		  this.state.imgsArrangeArr[index].isCenter = false
		  this.state.imgsArrangeArr[index].isInverse = false
	  })
	  otherArr = otherArr.concat(topArr)

	  // 左右两侧图片
	  let restLength = this.state.imgsArrangeArr.length - otherArr.length

	  let halfRestLength = Math.floor(restLength / 2)
	  console.log('halfRestLength', halfRestLength)

	  let leftArr = getRandomArrayElements(this.state.imgsArrangeArr, halfRestLength, otherArr)
	  console.log('leftArr', leftArr)

	  leftArr.forEach(index => {
		 this.state.imgsArrangeArr[index].pos = {
			 top: getRangeRandom(this.state.Constant.hPosRange.y[0], this.state.Constant.hPosRange.y[1]),
			 left: getRangeRandom(this.state.Constant.hPosRange.leftSecX[0], this.state.Constant.hPosRange.leftSecX[1])
		 }
		 this.state.imgsArrangeArr[index].rotate = get30DegRandom()
		 this.state.imgsArrangeArr[index].isCenter = false
		 this.state.imgsArrangeArr[index].isInverse = false
	 })
	 otherArr = otherArr.concat(leftArr)

	 // 右侧图片
	 this.state.imgsArrangeArr.forEach((item, index) => {
		if (otherArr.filter(other => other === index).length) {
			return false
		}
		this.state.imgsArrangeArr[index].pos = {
			top: getRangeRandom(this.state.Constant.hPosRange.y[0], this.state.Constant.hPosRange.y[1]),
			left: getRangeRandom(this.state.Constant.hPosRange.rightSecX[0], this.state.Constant.hPosRange.rightSecX[1])
		}
		this.state.imgsArrangeArr[index].rotate = get30DegRandom()
		this.state.imgsArrangeArr[index].isCenter = false
		this.state.imgsArrangeArr[index].isInverse = false
	})
	  /*
	  //上侧图片
	  let topImgNum = Math.ceil(Math.random() * 2) // 0 1
	  console.log('topImgNum', topImgNum)
	  //取出中心图片
	  let centerImg = this.state.imgsArrangeArr.splice(centerIndex, 1)[0]
	  centerImg.pos =  this.state.Constant.centerPos
	  centerImg.rotate = 0
	  centerImg.isCenter = true

	  console.log('centerImg', centerImg)
	  // 取出要布局上侧的图片的状态信息（取数组后面的）
	  let topImgSpliceIndex = Math.ceil(Math.random() * (this.state.imgsArrangeArr.length - topImgNum))
	  let imgsTopArr = this.state.imgsArrangeArr.splice(
		  topImgSpliceIndex, topImgNum
	  )
	  //布局位于上侧的图片
	  imgsTopArr.forEach((value, index) => {
		  imgsTopArr[index].pos = {
			  top: getRangeRandom(this.state.Constant.vPosRange.topY[0], this.state.Constant.vPosRange.topY[1]),
			  left: getRangeRandom(this.state.Constant.vPosRange.x[0], this.state.Constant.vPosRange.x[1])
		  }
		  imgsTopArr[index].rotate = get30DegRandom()
		  imgsTopArr[index].isInverse = false
		  imgsTopArr[index].isCenter = false
	  })
	  console.log('imgsTopArr', imgsTopArr)
	  // 布局左右两侧的图片信息
	  for (let i = 0, j = this.state.imgsArrangeArr.length, k = j / 2; i < j ; i++) {
		  // 左边
		  if (i < k) {
			  this.state.imgsArrangeArr[i].pos.left = getRangeRandom(this.state.Constant.hPosRange.leftSecX[0], this.state.Constant.hPosRange.leftSecX[1])
		  } else {
			 this.state.imgsArrangeArr[i].pos.left = getRangeRandom(this.state.Constant.hPosRange.rightSecX[0], this.state.Constant.hPosRange.rightSecX[1])
		  }

		  this.state.imgsArrangeArr[i].pos.top =  getRangeRandom(this.state.Constant.hPosRange.y[0], this.state.Constant.hPosRange.y[1])
		  this.state.imgsArrangeArr[i].rotate = get30DegRandom()
		  this.state.imgsArrangeArr[i].isInverse = false
		  this.state.imgsArrangeArr[i].isCenter = false
	  }

	  // 重新组合
	  this.state.imgsArrangeArr = this.state.imgsArrangeArr.concat(imgsTopArr)
	  this.state.imgsArrangeArr.push(centerImg)
	  this.setState({
		  imgsArrangeArr: this.state.imgsArrangeArr
	  })
	  */

	  this.setState({
		  imgsArrangeArr: this.state.imgsArrangeArr
	  })
  }
  componentWillMount() {
	  console.log('componentWillMount', this.state.imgsArrangeArr)
	  this.init()
  }
  // 组件加载
  componentDidMount() {
	  console.log('componentDidMount', this.state.imgsArrangeArr)
	  // 首先拿到舞台的大小
	  let stageW = this.stage.scrollWidth
	  let stageH = this.stage.scrollHeight
	  let halfStageW = Math.ceil(stageW / 2)
	  let halfStageH = Math.ceil(stageH / 2)

	  // 拿到一个图片figure的大小
	  let firstImgFigure = this.stage.childNodes[0].childNodes[0]
	  let imgW = firstImgFigure.scrollWidth
	  let imgH = firstImgFigure.scrollHeight
	  let halfImgW = Math.ceil(imgW/2)
	  let halfImgH = Math.ceil(imgH/2)
	  console.log('imgW', imgW)
	  console.log('imgH', imgH)
	  // 计算中心图片的位置点
	  this.state.Constant.centerPos = {
		  left: halfStageW - halfImgW,
		  top: halfStageH - halfImgH
	  };
	  //计算左侧 右侧区域图片排布的取值范围
	  this.state.Constant.hPosRange.leftSecX[0] = -halfImgW
	  this.state.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3
	  this.state.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW
	  this.state.Constant.hPosRange.rightSecX[1] = stageW - halfImgW
	  this.state.Constant.hPosRange.y[0] = -halfImgH
	  this.state.Constant.hPosRange.y[1] = stageH - halfImgH
	  // 计算垂直区域图片排布取值范围
	  this.state.Constant.vPosRange.topY[0] = -halfImgH
	  this.state.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3
	  this.state.Constant.vPosRange.x[0] = halfStageW -imgW
	  this.state.Constant.vPosRange.x[1] = halfStageW

	  this.rearrange(0) //第一张居中
  }

  // 初始化数据格式
  init = () => {
	  let temArr = []
	  imageDatas.forEach((item, index) => {
		  if (!temArr[index]) {
			  temArr[index] = {
				  pos: {
					  left: 0,
					  top: 0
				  },
				  rotate: 0,
				  isInverse: false,  //图片是否翻转
				  isCenter: false,  //图片是否是中心图片
				  imgData: item,
				  index: index
			  }
		  }
	  })
	  console.log('temArr', temArr)
	//   this.setState({ //这个是异步的。。。
	// 	  imgsArrangeArr: temArr
	//   })
	  this.state.imgsArrangeArr = temArr
	  console.log('_init_', this.state.imgsArrangeArr)
  }
  render() {
	  console.log('render', this.state.imgsArrangeArr)
	  let ImgFigureArr = []
	  this.state.imgsArrangeArr.forEach((item, index) => {
		  ImgFigureArr.push(<ImgFigure imgSrc={ './images/' + item.imgData.fileName}
					 text={item.imgData.title}
					 pos={item.pos}
					 key={item.index}
					 title={item.imgData.title}
					 rotate={item.rotate}
					 index={item.index}
					 isInverse={item.isInverse}
					 isCenter={item.isCenter}
					 inverse={this.inverse}
					 center={this.center}/>)
	  })
	return (
	  <section className="stage"
		ref={(dom) => {this.stage = dom}}
	  >
		<section className="img-sec">
			{ImgFigureArr}
		</section>
		<nav className="controller-nav">
		</nav>
	  </section>
	);
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
