export default class HaResponseTimeCommand {
  name = 'haresp';

  handler(ctx) {
    const jsonData = {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
          {
            label: 'Dogs',
            data: [50, 60, 70, 180, 190]
          },
          {
            label: 'Cats',
            data: [100, 200, 300, 400, 500]
          }
        ]
      }
    };

    ctx.builder()
      .text('abc')
      .photo(`https://quickchart.io/chart?c=${JSON.stringify(jsonData)}`)
      .answer();
  }
}
