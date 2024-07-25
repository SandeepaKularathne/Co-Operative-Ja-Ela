package lk.cooperative.cooperativejaela.entity;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.sql.Date;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Disrequests {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "disnumber")
    private String disnumber;
    @Basic
    @Column(name = "reqdate")
    private Date reqdate;
    @Basic
    @Column(name = "description")
    @Pattern(regexp = "^.*$", message = "Invalid Description")
    private String description;
    @OneToMany(mappedBy = "disrequests",cascade = CascadeType.ALL,orphanRemoval = true)
    private Collection<Disitem> disitems;

    @ManyToOne
    @JoinColumn(name = "disstatus_id", referencedColumnName = "id", nullable = false)
    private Disstatus disstatus;
    @ManyToOne
    @JoinColumn(name = "shop_id", referencedColumnName = "id", nullable = false)
    private Shop shop;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDisnumber() {
        return disnumber;
    }

    public void setDisnumber(String disnumber) {
        this.disnumber = disnumber;
    }

    public Date getReqdate() {
        return reqdate;
    }

    public void setReqdate(Date reqdate) {
        this.reqdate = reqdate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Disrequests)) return false;
        Disrequests that = (Disrequests) o;
        return getId() == that.getId() && Objects.equals(getDisnumber(), that.getDisnumber()) && Objects.equals(getReqdate(), that.getReqdate()) && Objects.equals(getDescription(), that.getDescription()) && Objects.equals(disitems, that.disitems) && Objects.equals(getDisstatus(), that.getDisstatus()) && Objects.equals(getShop(), that.getShop()) && Objects.equals(getEmployee(), that.getEmployee());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getDisnumber(), getReqdate(), getDescription(), disitems, getDisstatus(), getShop(), getEmployee());
    }

    public Collection<Disitem> getDisItems() {
        return disitems;
    }

    public void setDisItems(Collection<Disitem> disitems) {
        this.disitems = disitems;
    }

    public Disstatus getDisstatus() {
        return disstatus;
    }

    public void setDisstatus(Disstatus disstatus) {
        this.disstatus = disstatus;
    }

    public Shop getShop() {
        return shop;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
}
