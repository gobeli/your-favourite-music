<script>
  import { Doughnut } from 'vue-chartjs'

  export default Doughnut.extend({
    props: ['labels', 'data'],
    watch: {
      'getData': {
        handler: function (newData, oldData) {
          let chart = this._chart
          console.log(newData)
          let newDataLabels = newData.datasets.map((dataset) => {
            return dataset.label
          })

          let oldDataLabels = oldData.datasets.map((dataset) => {
            return dataset.label
          })
          if (JSON.stringify(newDataLabels) === JSON.stringify(oldDataLabels)) {
            newData.datasets.forEach(function (dataset, i) {
              chart.data.datasets[i].data = dataset.data
            })
            chart.data.labels = newData.labels
            chart.update()
          } else {
            this.renderChart(this.data, this.options)
          }
        },
        deep: true
      }
    },
    computed: {
      getData() {
        return {
          labels: this.labels,
          datasets: [
            {
              backgroundColor: ['#EAF2F8', '#D4E6F1', '#A9CCE3', '#7FB3D5', '#5499C7', '#2980B9', '#2471A3', '#1F618D', '#1A5276', '#154360' ],
              data: this.data
            }
          ]
        };
      }
    },
    mounted () {
      // Overwriting base render method with actual data.
      this.renderChart(this.getData, {responsive: true, maintainAspectRatio: false, legend: {position: 'bottom'} })
    }
  })
</script>
