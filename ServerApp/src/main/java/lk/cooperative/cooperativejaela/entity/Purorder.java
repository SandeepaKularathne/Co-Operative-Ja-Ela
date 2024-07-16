package lk.cooperative.cooperativejaela.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lk.cooperative.cooperativejaela.util.RegexPattern;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Purorder {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "ponumber")
    @Pattern(regexp = "^[A-Z\\s]{1,2}\\d{43}$", message = "Invalid Number")
    private String ponumber;
    @Basic
    @Column(name = "date")
    @RegexPattern(reg = "^\\d{2}-\\d{2}-\\d{2}$", msg = "Invalid Date Format")
    private Date date;
    @Basic
    @Column(name = "expectedcost")
    @RegexPattern(reg = "^[0-9]+(\\.[0-9]{1,2})?$", msg = "Invalid cost format.")
    private BigDecimal expectedcost;
    @Basic
    @Column(name = "description")
    @Pattern(regexp = "^.*$", message = "Invalid Description")
    private String description;
    @OneToMany(mappedBy = "purorder")
    private Collection<Poitem> poitems;
    @ManyToOne
    @JoinColumn(name = "postatus_id", referencedColumnName = "id", nullable = false)
    private Postatus postatus;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;
    @JsonIgnore
    @OneToMany(mappedBy = "purorder")
    private Collection<Grn> grns;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPonumber() {
        return ponumber;
    }

    public void setPonumber(String ponumber) {
        this.ponumber = ponumber;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public BigDecimal getExpectedcost() {
        return expectedcost;
    }

    public void setExpectedcost(BigDecimal expectedcost) {
        this.expectedcost = expectedcost;
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
        Purorder purorder = (Purorder) o;
        return id == purorder.id && Objects.equals(ponumber, purorder.ponumber) && Objects.equals(date, purorder.date) && Objects.equals(expectedcost, purorder.expectedcost) && Objects.equals(description, purorder.description);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, ponumber, date, expectedcost, description);
    }

    public Collection<Poitem> getPoitems() {
        return poitems;
    }

    public void setPoitems(Collection<Poitem> poitems) {
        this.poitems = poitems;
    }

    public Postatus getPostatus() {
        return postatus;
    }

    public void setPostatus(Postatus postatus) {
        this.postatus = postatus;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Collection<Grn> getGrns() {
        return grns;
    }

    public void setGrns(Collection<Grn> grns) {
        this.grns = grns;
    }
}
