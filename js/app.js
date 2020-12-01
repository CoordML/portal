let gpuCharts = new Map()

const renderGpuUsage = (workers) => {
    workers.map((worker, _) => {
        worker.gpuStatus.map((gpu, gpuIndex) => {
            var canvasId = 'gpu-canvas_' + worker.workerId + '_' + (gpuIndex + 1)
            var ctx = document.getElementById(canvasId).getContext('2d');
            if (gpuCharts.has(canvasId)) {
                var chart = gpuCharts.get(canvasId)
                chart.data.datasets[0].data = [gpu.load]
                chart.data.datasets[1].data = [gpu.memUsage.used]
                chart.update()
            } else {
                var chart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['GPU Usage'],
                        datasets: [
                            {
                                label: 'Load',
                                data: [gpu.load],
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                ],
                                borderWidth: 1,
                                yAxisID: 'left-y-axis'
                            },
                            {
                                label: 'Memory',
                                data: [gpu.memUsage.used],
                                backgroundColor: [
                                    'rgba(54, 162, 235, 0.2)',
                                ],
                                borderColor: [
                                    'rgba(54, 162, 235, 1)',
                                ],
                                borderWidth: 1,
                                yAxisID: 'right-y-axis'
                            }
                        ]
                    },
                    options: {
                        scales: {
                            ticks: {
                                beginAtZero: true
                            },
                            yAxes: [{
                                id: 'left-y-axis',
                                type: 'linear',
                                position: 'left',
                                ticks: {
                                    min: 0.0,
                                    max: 1.0
                                }
                            }, {
                                id: 'right-y-axis',
                                type: 'linear',
                                position: 'right',
                                ticks: {
                                    min: 0.0,
                                    max: gpu.memUsage.capacity,
                                    stepSize: gpu.memUsage.capacity / 2.0
                                }
                            }],
                        },
                        title: {
                            display: true,
                            text: gpu.name,
                            position: 'left'
                        }
                    }
                });
                gpuCharts.set(canvasId, chart);
            }
        })
    })
}

document.addEventListener("DOMContentLoaded", function (event) {
    var data = {
        expOverviews: [],
        workers: []
    }

    var app = new Vue({
        el: "#app",
        data: data,
        computed: {
            workerOverviews: function () {
                return this.workers.map((worker, idx) => {
                    const name = worker.name
                    const workerId = worker.workerId
                    const gpuNum = worker.gpuStatus.length
                    const workerIndex = idx
                    var overallLoad = 0.0
                    worker.gpuStatus.forEach(element => {
                        overallLoad += element.load
                    });
                    overallLoad /= gpuNum
                    return {
                        name: name,
                        workerId: workerId,
                        overallLoad: overallLoad,
                        gpuNum: gpuNum,
                        workerIndex: workerIndex
                    }
                })
            }
        }
    })

    const updateState = () => {
        fetch('http://localhost:8888/api/exp/listOverview')
            .then(resp => resp.json())
            .then(listing => {
                data.expOverviews = listing.experiments
            })
        fetch('http://localhost:8888/api/workers/list')
            .then(resp => resp.json())
            .then(listing => {
                data.workers = listing.workers
                renderGpuUsage(data.workers)
            })
    }

    setInterval(updateState, 1000);
});