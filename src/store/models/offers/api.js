const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

let todos = [
  {
    id: 1,
    order: 1,
    title: 'offer.refer.title',
    navigate: 'Referral',
    content: 'offer.refer.content',
    offerId: 'OFFER-REFERRAL',
    icon: 'ReferralIcon',
    offerDetail: {

    }
  },
  {
    id: 2,
    order: 2,
    navigate: 'LoanAgentSignup',
    title: 'offer.agent.title',
    content: 'offer.agent.content',
    offerId: 'OFFER-LOAN-AGENT',
    icon: 'LoanAgentIcon',
    offerDetail: {

    }
  },
  {
    id: 3,
    order: 1.5,
    title: 'offer.generic.diwali.title',
    navigate: 'Offers',
    icon: 'OfferIcon',
    content: 'offer.generic.diwali.content',
    offerId: 'OFFER-LOAN-DIWALI-2021',
    offerDetail: {

    }
  }
]

const get = async () => {
  await sleep(100)

  return todos
}

const getById = async id => {
  await sleep(100)

  return todos.find(item => item.id === id)
}

const create = async data => {
  await sleep(100)

  todos.push(data)

  return todos
}

const update = async (id, data) => {
  const todo = todos.find(item => item.id === id)
  const newTodo = Object.assign(todo, data)

  return newTodo
}

const remove = async id => {
  todos = todos.filter(todo => todo.id !== id)

  return todos
}

export const api = {
  get,
  getById,
  create,
  update,
  remove
}
