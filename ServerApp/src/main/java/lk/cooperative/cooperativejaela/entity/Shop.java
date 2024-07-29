package lk.cooperative.cooperativejaela.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Shop {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "shopnumber")
    @Pattern(regexp = "^\\d{3}$", message = "Invalid Number")
    private String shopnumber;
    @Basic
    @Column(name = "address")
    @Pattern(regexp = "^.*$", message = "Invalid Address")
    private String address;
    @Basic
    @Column(name = "cnumber")
    @Pattern(regexp = "^\\d{9,12}$", message = "Invalid Contact Number")
    private String cnumber;
    @Basic
    @Column(name = "email")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "Invalid Email Address")
    private String email;
    @Basic
    @Column(name = "opdate")
    private String opdate;
    @JsonIgnore
    @OneToMany(mappedBy = "shop")
    private Collection<Disrequests> disrequests;
    @ManyToOne
    @JoinColumn(name = "shopstatus_id", referencedColumnName = "id", nullable = false)
    private Shopstatus shopstatus;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;
    @JsonIgnore
    @OneToMany(mappedBy = "shop")
    private Collection<Invoice> invoices;
    @ManyToOne
    @JoinColumn(name = "route_id", referencedColumnName = "id", nullable = false)
    private Route route;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getShopnumber() {
        return shopnumber;
    }

    public void setShopnumber(String shopnumber) {
        this.shopnumber = shopnumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCnumber() {
        return cnumber;
    }

    public void setCnumber(String cnumber) {
        this.cnumber = cnumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOpdate() {
        return opdate;
    }

    public void setOpdate(String opdate) {
        this.opdate = opdate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Shop shop = (Shop) o;
        return id == shop.id && Objects.equals(shopnumber, shop.shopnumber) && Objects.equals(address, shop.address) && Objects.equals(cnumber, shop.cnumber) && Objects.equals(email, shop.email) && Objects.equals(opdate, shop.opdate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, shopnumber, address, cnumber, email, opdate);
    }

    public Collection<Disrequests> getDisrequests() {
        return disrequests;
    }

    public void setDisrequests(Collection<Disrequests> disrequests) {
        this.disrequests = disrequests;
    }

    public Shopstatus getShopstatus() {
        return shopstatus;
    }

    public void setShopstatus(Shopstatus shopstatus) {
        this.shopstatus = shopstatus;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Collection<Invoice> getInvoices() {
        return invoices;
    }

    public void setInvoices(Collection<Invoice> invoices) {
        this.invoices = invoices;
    }

    public Route getRoute() {
        return route;
    }

    public void setRoute(Route route) {
        this.route = route;
    }
}
