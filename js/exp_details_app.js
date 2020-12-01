document.addEventListener("DOMContentLoaded", function (event) {
    var data = {
        expId: null,
        resultsTable: {},
        resultsView: {}
    }

    const updateState = () => {
        fetch('http://localhost:8888/api/exp/listResults?expId=' + data.expId)
            .then(resp => resp.json())
            .then(listing => {
                data.resultsTable = listing
            })
        fetch('http://localhost:8888/api/exp/getResultView?expId=' + data.expId)
            .then(resp => resp.json())
            .then(listing => {
                console.log(listing)
                data.resultsView = listing
            })
    }

    var app = new Vue({
        el: "#app",
        data: data,
        created: function() {
            const urlParams = new URLSearchParams(window.location.search)
            this.expId = urlParams.get("expId")
            updateState()
            setInterval(updateState, 1000);
        }
    })

});