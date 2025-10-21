
// export const categoryData = [
//   { "name": "Art & Design", "id": 1 },
//   { "name": "Business Development", "id": 2 },
//   { "name": "IT & Software", "id": 3 },
//   { "name": "Health & Fitness", "id": 4 },
//   { "name": "Digital Marketing", "id": 5 },
//   { "name": "Personal Development", "id": 6 },
//   { "name": "Languages", "id": 7 },
//   { "name": "Finance & Accounting", "id": 8 },
//   { "name": "Science & Technology", "id": 9 },
//   { "name": "Education & Teaching", "id": 10 }
// ]

export const categoryData = Array.from({ length: 500 }, (_, index)=>({
  name: `Category ${index+1}`,
  id: `${index+1}`
}));
