const razorpayBtn=document.getElementById('razorpayBtn');

const priceField=document.getElementById('price');
const productField=document.getElementById('product');
const categoryField=document.getElementById('category');
async function addExpense(e){

    try{
        e.preventDefault();
        const price=priceField.value;
        const product=productField.value;
        const category=categoryField.value;
        console.log(price,product,category);
        const data={
            'price':price,
            'product':product,
            'category':category,
        };
        console.log(data);
        const token=localStorage.getItem('token');
        const res=await axios.post('http://localhost:3000/expense/post-expense',data,{headers:{"Authorization":token}});
        window.location.reload();
    }
    catch(err){
        console.log(err);
    }
    
}

document.getElementById('razorpayBtn').onclick= async function(e){
    e.preventDefault();
    const token=localStorage.getItem('token');
    const response=await axios.get('http://localhost:3000/purchase/premiumMembership',{headers:{"Authorization":token}});
    console.log(response);


    var options={
        "key":response.data.key_id,//key id generated from the dashboard
        "order_id":response.data.order.id,//order id for a particular order
        "handler": async function(response){
            await axios.post('http://localhost:3000/purchase/updateTransactionStatus',{
                order_id:options.order_id,
                payment_id:response.razorpay_payment_id
            },{headers:{"Authorization":token}});

            alert("You are a premium user now");
            window.location.reload();
        }
    };

    const rzp1=new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on("payment.failed",function(response){
        console.log(response);
        alert("Something went wrong");
    });
}

document.addEventListener('DOMContentLoaded',async()=>{
    
    const token=localStorage.getItem('token');
    const response=await axios.get('http://localhost:3000/purchase/premiumOrNot',{headers:{"Authorization":token}});
    const isPremium=response.data.isPremium;
    
    if(isPremium==='true'){
        razorpayBtn.innerHTML='Premium User';
        razorpayBtn.classList.add('premiumButton');
    }
})

