<script>
export default {
  globalData: {
    registeredUsername: null
  },
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
page {
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', sans-serif;
  font-size: 34rpx;
  line-height: 1.65;
  letter-spacing: 0.5rpx;
  background-color: #f5f7fa;
  color: #1f2d3d;
}

text, view {
  font-size: inherit;
  line-height: inherit;
}

.accessibility-highlight {
  color: #1f2d3d;
  font-weight: 600;
}

.accessibility-subtle {
  color: #5c6673;
}
</style>
