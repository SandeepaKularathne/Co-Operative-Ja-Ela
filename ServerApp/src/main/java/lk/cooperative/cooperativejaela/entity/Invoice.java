package lk.cooperative.cooperativejaela.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Invoice {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "date")
    private Date date;
    @Basic
    @Column(name = "grandtotal")
    private BigDecimal grandtotal;
    @Basic
    @Column(name = "invnumber")
    private String invnumber;

    @OneToMany(mappedBy = "invoice",cascade = CascadeType.ALL,orphanRemoval = true)
    private Collection<Iteminvoice> iteminvoices;
    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id", nullable = false)
    private Customer customer;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;
    @ManyToOne
    @JoinColumn(name = "shop_id", referencedColumnName = "id", nullable = false)
    private Shop shop;
    @JsonIgnore
    @OneToMany(mappedBy = "invoice")
    private Collection<Payment> payments;
    @JsonIgnore
    @OneToMany(mappedBy = "invoice")
    private Collection<Customerreturn> customerreturnsById;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public BigDecimal getGrandtotal() {
        return grandtotal;
    }

    public void setGrandtotal(BigDecimal grandtotal) {
        this.grandtotal = grandtotal;
    }

    public String getInvnumber() {
        return invnumber;
    }

    public void setInvnumber(String invnumber) {
        this.invnumber = invnumber;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Invoice invoice = (Invoice) o;
        return id == invoice.id && Objects.equals(date, invoice.date) && Objects.equals(grandtotal, invoice.grandtotal) && Objects.equals(invnumber, invoice.invnumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, date, grandtotal, invnumber);
    }

    public Collection<Iteminvoice> getIteminvoices() {
        return iteminvoices;
    }

    public void setIteminvoices(Collection<Iteminvoice> iteminvoices) {
        this.iteminvoices = iteminvoices;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Shop getShop() {
        return shop;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }

    public Collection<Payment> getPayments() {
        return payments;
    }

    public void setPayments(Collection<Payment> payments) {
        this.payments = payments;
    }

    public Collection<Customerreturn> getCustomerreturnsById() {
        return customerreturnsById;
    }

    public void setCustomerreturnsById(Collection<Customerreturn> customerreturnsById) {
        this.customerreturnsById = customerreturnsById;
    }
}
