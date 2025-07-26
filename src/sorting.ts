console.log('Стартуем!');


const db = [
    {id:0, name: 'oleg', age: 3},
    {id:1, name: 'dima', age: 32},
    {id:2, name: 'marsel', age: 31},
    {id:3, name: 'boomer', age: 20},
]

db.push({id:4, name: 'test', age: 11})

const getUsers = () => {
    return [...db].sort((a, b) => {
        if (a.age < b.age) {
            return -1
        } else if (a.age > b.age) {
            return 1
        } else {
            return 0
        }
    })
}

console.log(getUsers())