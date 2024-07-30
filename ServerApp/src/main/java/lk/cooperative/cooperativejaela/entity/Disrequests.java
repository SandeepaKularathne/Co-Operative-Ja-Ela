package lk.cooperative.cooperativejaela.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
    @JsonIgnore
    @OneToMany(mappedBy = "disrequests")
    private Collection<Disorder> disorders;

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
        if (o == null || getClass() != o.getClass()) return false;
        Disrequests that = (Disrequests) o;
        return id == that.id && Objects.equals(disnumber, that.disnumber) && Objects.equals(reqdate, that.reqdate) && Objects.equals(description, that.description);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, disnumber, reqdate, description);
    }

    public Collection<Disitem> getDisitems() {
        return disitems;
    }

    public void setDisitems(Collection<Disitem> disitems) {
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

    public Collection<Disorder> getDisorders() {
        return disorders;
    }

    public void setDisorders(Collection<Disorder> disorders) {
        this.disorders = disorders;
    }
}
