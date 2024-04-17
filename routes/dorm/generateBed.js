var beds = [];
function generateBed(gender, dorm, n3, n2) {
        for (let i = 1; i <= n2; i++) {
            let obj = {
                bId: gender + dorm + i,
                type: 2,
                verified: false 
            };
            let obj2 = {
                bId: gender + dorm + i + 'U',
                type: 2,
                verified: false
            };
            let combined = [obj, obj2];
            beds = [...beds, ...combined];
        }

        for (let i = 1; i <= n3; i++) {
            let obj = {
                bId: gender + dorm + i ,
                type: 3,
                verified: false 
            };
            let obj2 = {
                bId: gender + dorm + i + 'U',
                type: 3,
                verified: false
            };
            let obj3 = {
                bId: gender + dorm + i + 'UU',
                type: 3,
                verified: false
            };
            let combined = [obj, obj2, obj3];
            beds = [...beds, ...combined];
        }
    }
