const Coconut = require('coconutjs')

const coconut = new Coconut.Client(process.env.COCONUT_API)

export default async function handler(req, res) {
  /*{
  job_id: 'J2lLvdPvgOxa5z',
  event: 'job.completed',
  metadata: false,
  data: {
    type: 'job',
    status: 'job.completed',
    progress: '100%',
    id: 'J2lLvdPvgOxa5z',
    created_at: '2022-08-04 01:45:40 +0000',
    completed_at: '2022-08-04 01:45:53 +0000',
    input: { status: 'input.transferred' },
    outputs: [ [Object], [Object], [Object] ]
  }
}*/
  try {
    let { event, data } = req.body
    if (event == 'job.completed') {
      console.log(data.outputs)
    } else {
      console.log(req.body)
    }
  } catch (e) {
    console.log(error)
  }

  return res.send({ success: true })
}
